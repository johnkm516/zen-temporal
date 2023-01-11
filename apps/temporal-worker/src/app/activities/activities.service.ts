import { Injectable } from '@nestjs/common';
import { Activities, Activity } from 'nestjs-temporal';

@Injectable()
@Activities()
export class ActivitiesService {
  constructor() {}

  @Activity()
  async greeting(name: string): Promise<string> {
    return 'Hello ' + name;
  }
}

export interface ITemporalActivities  {
    greeting(name: string): Promise<string>;
}