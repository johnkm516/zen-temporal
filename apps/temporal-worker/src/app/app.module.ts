import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { TemporalWorkerModule } from './worker/worker.module';
import { TemporalClientController } from './controller/clientController';
import { TemporalClientModule } from './temporalClient/temporalClient.module';
import { ApolloClientModule } from './apolloClient/apolloClient.module';

@Module({
  imports: [
    ConfigModule,
    ApolloClientModule,
    TemporalClientModule,
    TemporalWorkerModule
  ],
  controllers: [TemporalClientController],
})
export class AppModule {}
