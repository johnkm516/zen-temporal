import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ApolloClientModule } from '../apolloClient/apolloClient.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '../config';

@Module({
  imports: [ApolloClientModule, HttpModule, ConfigModule],
  providers: [ActivitiesService]
})
export class ActivitiesModule {}
