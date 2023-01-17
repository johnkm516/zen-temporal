import { FetchPolicy, gql } from '@apollo/client/core';
import { MutationFetchPolicy } from '@apollo/client/core/watchQueryOptions';
import { getOperationDefinition } from '@apollo/client/utilities';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Activities, Activity } from 'nestjs-temporal';
import { ApolloClientService } from '../apolloClient/apolloClient.service';
import { ConfigService } from '../config';
import { MailService } from '../mail/mail.service';

@Injectable()
@Activities()
export class ActivitiesService {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly httpService: HttpService,
    protected readonly apolloClientService: ApolloClientService,
    protected readonly mailService: MailService
  ) {}
  @Activity()
  async graphQLRequest(
    queryString: string,
    variables?: {},
    fetchPolicy?: FetchPolicy | MutationFetchPolicy
  ): Promise<any> {
    const graphQLRequest = gql`
      ${queryString}
    `;

    if (getOperationDefinition(graphQLRequest).operation === 'query') {
      return await this.apolloClientService.query({
        query: graphQLRequest,
        variables: variables,
        fetchPolicy: fetchPolicy as FetchPolicy,
      });
    } else if (
      getOperationDefinition(graphQLRequest).operation === 'mutation'
    ) {
      return await this.apolloClientService.mutate({
        mutation: graphQLRequest,
        variables: variables,
        fetchPolicy: fetchPolicy as MutationFetchPolicy,
      });
    }
  }
}