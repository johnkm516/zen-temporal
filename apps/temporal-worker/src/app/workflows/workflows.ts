import { proxyActivities } from '@temporalio/workflow';
import { ITemporalActivities } from '../activities/activities.service';
// Only import the activity types

const { greeting } = proxyActivities<ITemporalActivities>({
  startToCloseTimeout: '1 minute',
});

export async function example(name: string): Promise<string> {
  return await greeting(name);
}