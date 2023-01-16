import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { TemporalWorkerModule } from './worker/worker.module';
import { SubscriptionsController } from './controller/clientController';
import { TemporalClientModule } from './temporalClient/temporalClient.module';
import { ApolloClientModule } from './apolloClient/apolloClient.module';

@Module({
  imports: [
    ConfigModule,
    ApolloClientModule,
    TemporalClientModule,
    TemporalWorkerModule
  ],
  controllers: [SubscriptionsController],
})
export class AppModule {}
