import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { Activities } from 'nestjs-temporal/dist/decorators/activities.decorator';
import { Activity } from 'nestjs-temporal/dist/decorators/activity.decorator';
import { GeneralContext } from '../../mail/contexts/general.context';
import { Customer } from '../../types/Customer';
import { ActivitiesService } from '../activities.service';

@Injectable()
@Activities()
export default class SubscriptionActivities extends ActivitiesService {
  @Activity()
  async sendWelcomeEmail(email: string): Promise<void> {
    const i = typeof ActivitiesService;
    const mailContext: GeneralContext = {
      siteUrl: 'localhost:3000',
      hiddenPreheaderText: 'hiddenPreheaderText',
      header: 'WELCOME',
      subHeading: 'Welcome to your new subscription',
      body: 'lorem ipsum subscriptions temporal welcome hihihihihihihihihihihi world',
      footerHeader: 'Generic Footer',
      footerBody: 'I have no body',
    };
    return await this.mailService.sendGeneral({
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
    return await this.mailService.sendGeneral({
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
    return await this.mailService.sendGeneral({
      to: email,
      subject: '[Temporal] Your subscription has been cancelled',
      context: mailContext,
    });


  }

  @Activity()
  async sendSubscriptionOverEmail(email: string): Promise<void> {
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
    return await this.mailService.sendGeneral({
      to: email,
      subject: '[Temporal] Your subscription has expired!',
      context: mailContext,
    });

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
      subHeading: 'You have been charged!',
      body: `You have been charged for the amount of ${
        _customer.Subscription.initialBillingPeriodCharge
      }. You have been charged a total of ${(totalCharged +=
        _customer.Subscription.initialBillingPeriodCharge)}`,
      footerHeader: 'Generic Footer',
      footerBody: 'I have no body',
    };
    return await this.mailService.sendGeneral({
      to: _customer.Email,
      subject: '[Temporal] Your monthly subscription invoice.',
      context: mailContext,
    });
  }
}

