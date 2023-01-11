import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { TemporalWorkerModule } from './worker/worker.module';
import { TemporalClientController } from './controller/clientController';
import { TemporalClientModule } from './client/client.module';

@Module({
  imports: [
    ConfigModule,
    TemporalClientModule,
    TemporalWorkerModule
  ],
  controllers: [TemporalClientController],
})
export class AppModule {}
