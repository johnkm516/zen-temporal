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
import { Customer } from '../workflows/types/Customer';

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

  @Activity()
  async sendWelcomeEmail(email: string): Promise<void> {
    const mailContext: GeneralContext = {
      siteUrl: 'localhost:3000',
      hiddenPreheaderText: 'hiddenPreheaderText',
      header: 'WELCOME',
      subHeading: 'Welcome to your new subscription',
      body: 'lorem ipsum subscriptions temporal welcome hihihihihihihihihihihi world',
      footerHeader: 'Generic Footer',
      footerBody: 'I have no body',
    };
    await this.mailService.sendGeneral({
      to: email,
      subject: '[Temporal] Welcome to your new subscription!',
      context: mailContext,
    });
  }

  @Activity()
  async sendCancellationEmailDuringTrialPeriod(email: string): Promise<void> {
    const mailContext: GeneralContext = {
      siteUrl: 'localhost:3000',
      hiddenPreheaderText: 'hiddenPreheaderText',
      header: 'Subscription Cancellation',
      subHeading: 'Are you sure you want to cancel?',
      body: `<a href="localhost:3050/subscribe">
      <button class="button">Click here to subscribe for only $99999999999999.99!</button>
      </a>`,
      footerHeader: 'Generic Footer',
      footerBody: 'I have no body',
    };
    await this.mailService.sendGeneral({
      to: email,
      subject: '[Temporal] Your subscription has been cancelled',
      context: mailContext,
    });
  }

  @Activity()
  async sendCancellationEmailDuringActiveSubscription(
    email: string
  ): Promise<void> {
    const mailContext: GeneralContext = {
      siteUrl: 'localhost:3000',
      hiddenPreheaderText: 'hiddenPreheaderText',
      header: 'Subscription Cancellation',
      subHeading: 'Are you sure you want to cancel?',
      body: `<a href="localhost:3050/subscribe">
      <button class="button">Click here to subscribe for only $99999999999999.99!</button>
      </a>`,
      footerHeader: 'Generic Footer',
      footerBody: 'I have no body',
    };
    await this.mailService.sendGeneral({
      to: email,
      subject: '[Temporal] Your subscription has been cancelled',
      context: mailContext,
    });

    console.log(
      'ALERT: CUSTOMER CANCELLED ACTIVE SUBSCRIPTION! SPAM CALLS TO CUSTOMER WITH NEW SUBSCRIPTION OFFERS'
    );
  }

  @Activity()
  async sendSubscriptionOverEmail(
    email: string
  ): Promise<void> {
    const mailContext: GeneralContext = {
      siteUrl: 'localhost:3000',
      hiddenPreheaderText: 'hiddenPreheaderText',
      header: 'Subscription Has Expired!',
      subHeading: 'Resubscribe to get access!',
      body: `<a href="localhost:3050/subscribe">
      <button class="button">Click here to subscribe for only $99999999999999.99!</button>
      </a>`,
      footerHeader: 'Generic Footer',
      footerBody: 'I have no body',
    };
    await this.mailService.sendGeneral({
      to: email,
      subject: '[Temporal] Your subscription has expired!',
      context: mailContext,
    });

    console.log(
      'ALERT: CUSTOMER CANCELLED ACTIVE SUBSCRIPTION! SPAM CALLS TO CUSTOMER WITH NEW SUBSCRIPTION OFFERS'
    );
  }

  @Activity()
  async chargeCustomerForBillingPeriod(
    _customer: Customer,
    _amount: number,
    totalCharged: number
  ): Promise<void> {
    console.log(
      'Charged customer : ' +
        _customer.Email +
        ' for the amount of : ' +
        _amount
    );
    const mailContext: GeneralContext = {
      siteUrl: 'localhost:3000',
      hiddenPreheaderText: 'hiddenPreheaderText',
      header: 'Your account has been charged for the monthly subscription.',
      subHeading: 'Youo have been charged!',
      body: `You have been charged for the amount of ${_customer.Subscription.initialBillingPeriodCharge}. You have been charged a total of ${totalCharged += _customer.Subscription.initialBillingPeriodCharge}`,
      footerHeader: 'Generic Footer',
      footerBody: 'I have no body',
    };
    await this.mailService.sendGeneral({
      to: _customer.Email,
      subject: '[Temporal] Your monthly subscription invoice.',
      context: mailContext,
    });
  }
}

export interface ITemporalActivities {
  greeting(name: string): Promise<string>;
  graphQLRequest(
    queryString: string,
    variables?: {},
    fetchPolicy?: FetchPolicy | MutationFetchPolicy
  ): Promise<any>;
  sendWelcomeEmail(email: string): Promise<void>;
  sendCancellationEmailDuringTrialPeriod(email: string): Promise<void>;
  chargeCustomerForBillingPeriod(
    _customer: Customer,
    _amount: number,
    totalCharged: number
  ): Promise<void>;
  sendCancellationEmailDuringActiveSubscription(email: string): Promise<void>;
  sendSubscriptionOverEmail(
    email: string
  ): Promise<void>;
}
