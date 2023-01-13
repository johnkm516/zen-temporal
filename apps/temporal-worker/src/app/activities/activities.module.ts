import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ApolloClientModule } from '../apolloClient/apolloClient.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '../config';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [ApolloClientModule, HttpModule, ConfigModule, MailModule],
  providers: [ActivitiesService, MailService]
})
export class ActivitiesModule {}
