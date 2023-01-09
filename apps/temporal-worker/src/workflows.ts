import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';

const { greet } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

const { graphQLRequest } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

/** A workflow that simply calls an activity */
export async function example(name: string): Promise<string> {
  return await greet(name);
}

export async function graphQLWorkflow() {
  await graphQLRequest(
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
