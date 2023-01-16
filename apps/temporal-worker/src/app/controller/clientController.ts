import { Controller, Get, Param, Post } from '@nestjs/common';
import { Connection, WorkflowClient } from '@temporalio/client';
import { InjectTemporalClient } from 'nestjs-temporal';
import { cancelSubscription } from '../workflows/workflows'

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    @InjectTemporalClient() private readonly temporalClient: WorkflowClient
  ) {}

  @Get()
  async greeting() {
    const handle = await this.temporalClient.start('graphQLTest', {
      taskQueue: 'default',
      workflowId: 'wf-id-SENDEMAIL' + Math.floor(Math.random() * 1000),
    });
  }

  @Get('subscribe/:email')
  async subscribe(@Param('email') email) {
    const Customer = {
      FirstName: 'john',
      LastName: 'kim',
      Email: email,
      Subscription: {
        TrialPeriod: 10000,
        BillingPeriod: 60000,
        MaxBillingPeriods: 5,
        initialBillingPeriodCharge: 9999.99,
      },
      Id: email,
    };
    const handle = await this.temporalClient.start('SubscriptionWorkflow', {
      args: [Customer],
      taskQueue: 'default',
      workflowId: 'wf-id-SUBSCRIPTION_' + email,
    });
  }

  @Get('subscribe/cancel/:email')
  async subscriptionCancel(@Param('email') email) {
    const Customer = {
      FirstName: 'john',
      LastName: 'kim',
      Email: email,
      Subscription: {
        TrialPeriod: 10000,
        BillingPeriod: 60000,
        MaxBillingPeriods: 5,
        initialBillingPeriodCharge: 9999.99,
      },
      Id: email,
    };
    try {
      const handle = this.temporalClient.getHandle('wf-id-SUBSCRIPTION_' + email);
      await handle.signal(cancelSubscription);
    } catch (err: any) {
      if (err.details) console.error(err.details);
      else console.error(err);
    }
  }
}
