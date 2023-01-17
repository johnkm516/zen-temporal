import { proxyActivities } from '@temporalio/workflow';
import { ITemporalActivities } from '../activities';

//Activities
const activities = proxyActivities<ITemporalActivities>({
    startToCloseTimeout: '1 minute',
  });
  
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