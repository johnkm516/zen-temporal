import { Injectable } from '@nestjs/common';
import {
  ApolloClient,
  NormalizedCacheObject,
  ApolloClientOptions,
  fromPromise,
  from,
  createHttpLink,
  InMemoryCache,
  ApolloLink,
  ErrorPolicy,
} from '@apollo/client/core';
import { ConfigService } from '../config';
import { onError } from '@apollo/client/link/error';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { map } from 'rxjs/internal/operators/map';

@Injectable()
export class ApolloClientService extends ApolloClient<NormalizedCacheObject> {
  private token: string;
  private isRefreshing: boolean = false;
  private pendingRequests: any[] = [];

  constructor(
    protected readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    const authLink = new ApolloLink((operation, forward) => {
      // Use the setContext method to set the HTTP headers.
      operation.setContext({
        headers: {
          authorization: this.token != '' ? `Bearer ${this.token}` : '',
        },
      });
      return forward(operation);
    });

    const httpLink = createHttpLink({
      uri: configService.API_URL,
    });

    const resolvePendingRequests = () => {
      this.pendingRequests.map((callback) => callback());
      this.pendingRequests = [];
    };

    const addPendingRequest = (pendingRequest: any) => {
      this.pendingRequests.push(pendingRequest);
    };

    const headers = {
      'content-type': 'application/json',
    };
    const graphqlQuery = {
      operationName: 'AuthLogin',
      query: `query AuthLogin($data: AuthLoginInput!) {
            authLogin(data: $data) {
                token
            }
        }`,
      variables: {
        data: {
          password: configService.API_PASSWORD,
          rememberMe: true,
          username: configService.API_USERNAME,
        },
      },
    };

    const httpRequestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(graphqlQuery),
    };

    const getNewToken = async () => {
      const {
        data: {
          authLogin: { token: accessToken },
        },
      } = await lastValueFrom(
        this.httpService
          .post(configService.API_URL, null, httpRequestOptions)
          .pipe(
            map((response) => {
              return response;
            })
          )
      );
      console.log(this.token);
      this.token = accessToken;
    };

    const errorLink = onError(({ graphQLErrors, operation, forward }) => {
      if (graphQLErrors) {
        for (const err of graphQLErrors) {
          console.log('PRINTING ERROR' + err);
          switch (err?.message) {
            case 'Unauthorized':
              if (!this.isRefreshing) {
                this.isRefreshing = true;

                return fromPromise(
                  getNewToken().catch(() => {
                    resolvePendingRequests();
                    this.isRefreshing = false;
                    this.token = '';
                    return forward(operation);
                  })
                ).flatMap(() => {
                  resolvePendingRequests();
                  this.isRefreshing = false;

                  return forward(operation);
                });
              } else {
                return fromPromise(
                  new Promise<void>((resolve) => {
                    addPendingRequest(() => resolve());
                  })
                ).flatMap(() => {
                  return forward(operation);
                });
              }
          }
        }
      }
    });

    const cache = new InMemoryCache();

    const options: ApolloClientOptions<NormalizedCacheObject> = {
      link: from([errorLink, authLink, httpLink]),
      cache,
      credentials: 'include',
      defaultOptions: {
        query: {
          errorPolicy: 'all' as ErrorPolicy,
        },
        mutate: {
          errorPolicy: 'all' as ErrorPolicy,
        },
      },
    };
    super(options);
  }
}
