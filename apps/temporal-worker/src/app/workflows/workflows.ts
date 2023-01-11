import { proxyActivities } from '@temporalio/workflow';
import { ITemporalActivities } from '../activities/activities.service';
// Only import the activity types

const { greeting } = proxyActivities<ITemporalActivities>({
  startToCloseTimeout: '1 minute',
});

const { graphQLRequest } = proxyActivities<ITemporalActivities>({
  startToCloseTimeout: '1 minute',
});

export async function example(): Promise<string> {
  return await graphQLRequest(
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