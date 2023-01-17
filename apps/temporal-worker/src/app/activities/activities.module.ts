import { Module } from '@nestjs/common';
import { ApolloClientModule } from '../apolloClient/apolloClient.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '../config';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';
import { ActivitiesServices } from '.';

@Module({
  imports: [ApolloClientModule, HttpModule, ConfigModule, MailModule],
  providers: [...ActivitiesServices, MailService]
})
export class ActivitiesModule {}
