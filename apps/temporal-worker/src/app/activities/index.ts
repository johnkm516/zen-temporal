import { ActivitiesService } from "./activities.service";
import SubscriptionActivities from "./activityServices/activities.subscription";


type PickMatching<T, V> =
    { [K in keyof T as T[K] extends V ? K : never]: T[K] }

type ExtractMethods<T> = PickMatching<T, Function>;

export const ActivitiesServices = [SubscriptionActivities]
export type ITemporalActivities = ExtractMethods<SubscriptionActivities & ActivitiesService> 