import { FetchPolicy, gql } from '@apollo/client/core';
import { MutationFetchPolicy } from '@apollo/client/core/watchQueryOptions';
import { getOperationDefinition } from '@apollo/client/utilities';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Activities, Activity } from 'nestjs-temporal';
import { ApolloClientService } from '../apolloClient/apolloClient.service';
import { ConfigService } from '../config';
import { MailService } from '../mail/mail.service';
import { GeneralContext } from '../mail/contexts/general.context';

@Injectable()
@Activities()
export class ActivitiesService {
  constructor(
    protected readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly apolloClientService: ApolloClientService,
    private readonly mailService: MailService
  ) {}

  @Activity()
  async greeting(name: string): Promise<string> {
    return 'Hello ' + name;
  }

  @Activity()
  async graphQLRequest(queryString: string, variables?: {}, fetchPolicy?: FetchPolicy | MutationFetchPolicy): Promise<any> {
    const graphQLRequest = gql`${queryString}`;
  
    if (getOperationDefinition(graphQLRequest).operation === 'query') {
      return await this.apolloClientService.query({
        query: graphQLRequest,
        variables: variables,
        fetchPolicy: fetchPolicy as FetchPolicy
      })
    } else if (getOperationDefinition(graphQLRequest).operation === 'mutation') {
      return await this.apolloClientService.mutate({
        mutation: graphQLRequest,
        variables: variables,
        fetchPolicy: fetchPolicy as MutationFetchPolicy
      })
    }
  }

  @Activity()
  async sendWelcomeEmail(email: string): Promise<void> {
    const mailContext: GeneralContext = {
      siteUrl: "asdf",
      hiddenPreheaderText: "hiddenPreheaderText",
      header: "header",
      subHeading: "subHeading",
      body: "body",
      footerHeader: "footerHeader",
      footerBody: "footerBody",
    }
    await this.mailService.sendGeneral({to: email, subject: "WELCOME TEST", context: mailContext});
  }

  @Activity()
  async sendCancellationEmailDuringTrialPeriod(email: string): Promise<void> {
    const mailContext: GeneralContext = {
      siteUrl: "asdf",
      hiddenPreheaderText: "hiddenPreheaderText",
      header: "header",
      subHeading: "subHeading",
      body: "body",
      footerHeader: "footerHeader",
      footerBody: "footerBody",
    }
    await this.mailService.sendGeneral({to: email, subject: "CANCELLATION TEST", context: mailContext});
  }
}

export interface ITemporalActivities {
  greeting(name: string): Promise<string>;
  graphQLRequest(queryString: string, variables?: {}, fetchPolicy?: FetchPolicy | MutationFetchPolicy): Promise<any>;
  sendWelcomeEmail(email: string): Promise<void>;
  sendCancellationEmailDuringTrialPeriod(email: string): Promise<void>
}
