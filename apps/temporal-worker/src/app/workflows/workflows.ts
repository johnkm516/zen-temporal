import { proxyActivities } from '@temporalio/workflow';
import { ITemporalActivities } from '../activities/activities.service';
import * as wf from "@temporalio/workflow";

//Signals
export const cancelSubscription = wf.defineSignal("cancelSubscription");

//Activities
const activities = proxyActivities<ITemporalActivities>({
  startToCloseTimeout: '1 minute',
});

export async function SubscriptionWorkflow(customerEmail: string, trialPeriod: string | number) {
  let trialCanceled = false;
  wf.setHandler(cancelSubscription, () => void (trialCanceled = true));
  await activities.sendWelcomeEmail(customerEmail);
  if (await wf.condition(() => trialCanceled, trialPeriod)) {
    await activities.sendCancellationEmailDuringTrialPeriod(customerEmail);
  } else {
    //await BillingCycle(customerEmail);
  }
}
/*

async function BillingCycle(customerEmail: string) {
  const customer = useState('customer', customerEmail); // wrapped up signals + queries + state
  const period = useState('period', 0); // same
  let isCanceled = false;
  wf.setHandler(cancelSubscription, () => void (isCanceled = true));
  await activities.chargeCustomerForBillingPeriod(customerEmail);
  for (; period.value < customer.value.maxBillingPeriods; period.value++) {
    // Wait 1 billing period to charge customer or if they cancel subscription
    // whichever comes first
    if (await wf.condition(() => isCanceled, customer.billingPeriod)) {
      // If customer cancelled their subscription send notification email
      await activities.sendCancellationEmailDuringActiveSubscription(customerEmail);
      break;
    } else {
      await activities.chargeCustomerForBillingPeriod(customerEmail);
    }
  }
  // if we get here the subscription period is over
  if (!isCanceled) await activities.sendSubscriptionOverEmail(customerEmail);
}
*/

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