import { proxyActivities } from '@temporalio/workflow';
import { ITemporalActivities } from '../activities/activities.service';
import * as wf from "@temporalio/workflow";
import { useState } from './utils/useState';
import { Customer } from './types/Customer';

//Signals
export const cancelSubscription = wf.defineSignal("cancelSubscription");

//Activities
const activities = proxyActivities<ITemporalActivities>({
  startToCloseTimeout: '1 minute',
});

export async function SubscriptionWorkflow(
  customer: Customer
): Promise<string> {
  let subscriptionCancelled = false;
  let totalCharged = 0;

  const CustomerIdName = useState("CustomerIdName", "customerid");
  const BillingPeriodNumber = useState("BillingPeriodNumber", 0);
  const BillingPeriodChargeAmount = useState(
    "BillingPeriodChargeAmount",
    customer.Subscription.initialBillingPeriodCharge
  );

  wf.setHandler(CustomerIdName.query, () => customer.Id);
  wf.setHandler(cancelSubscription, () => void (subscriptionCancelled = true));

  // Send welcome email to customer
  await activities.sendWelcomeEmail(customer.Email);
  console.log("Starting trial period...")
  console.log("Trial period (in milleseconds: " + customer.Subscription.TrialPeriod)
  console.log("Billing Period (in milleseconds): " + customer.Subscription.BillingPeriod)
  // Start the free trial period. User can still cancel subscription during this time
  if (
    await wf.condition(
      () => subscriptionCancelled,
      customer.Subscription.BillingPeriod
    )
  ) {
    // If customer cancelled their subscription during trial period, send notification email
    console.log("Subscription cancelled during trial period!");
    await activities.sendCancellationEmailDuringTrialPeriod(customer.Email);
    // We have completed subscription for this customer.
    // Finishing workflow execution
    return "Subscription finished for: " + customer.Id;
  } else {
    // Trial period is over, start billing until
    // we reach the max billing periods for the subscription
    // or sub has been cancelled
    // eslint-disable-next-line no-constant-condition
    while (true) {
      console.log("In billing loop");
      console.log("Billing Period value : " + BillingPeriodNumber.value);
      console.log("Max Billing Period value : "+ customer.Subscription.MaxBillingPeriods);
      if (BillingPeriodNumber.value >= customer.Subscription.MaxBillingPeriods)
        break;
      console.log("charging", customer.Id, BillingPeriodChargeAmount.value);
      await activities.chargeCustomerForBillingPeriod(
        customer,
        BillingPeriodChargeAmount.value,
        totalCharged
      );
      totalCharged += BillingPeriodChargeAmount.value;
      // Wait 1 billing period to charge customer or if they cancel subscription
      // whichever comes first
      if (
        await wf.condition(
          () => subscriptionCancelled,
          customer.Subscription.BillingPeriod
        )
      ) {
        // If customer cancelled their subscription send notification email
        await activities.sendCancellationEmailDuringActiveSubscription(
          customer.Email
        );
        break;
      }
      BillingPeriodNumber.value++;
    }
    // if we get here the subscription period is over
    // notify the customer to buy a new subscription
    if (!subscriptionCancelled) {
      await activities.sendSubscriptionOverEmail(customer.Email);
    }
    return (
      "Completed " +
      wf.workflowInfo().workflowId +
      ", Total Charged: " +
      totalCharged
    );
  }
}

//Workflows
export async function mailTest(): Promise<void> {
  return await activities.sendWelcomeEmail("johnkim@hansae.com");
}

export async function graphQLTest(): Promise<string> {
  return await activities.graphQLRequest(
    `query Calendar($where: Auth_CalendarsOnUsersWhereInput) {
      accountInfo {
        calendars(where: $where) {
          calendar {
            calendarEvents {
              calendarEvent {
                allDay
                end
                id
                start
                title
                url
              }
            }
            calendarType
          }
        }
      }
    }`.replace(/\s/g, ' '),
    {
      where: {
        calendar: {
          calendarType: {
            in: ["Business"]
          }
        }
      }
    }
  );
}