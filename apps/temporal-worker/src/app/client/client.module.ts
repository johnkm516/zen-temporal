import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { TemporalModule as NestTemporalClient } from 'nestjs-temporal';
import { Connection } from '@temporalio/client';

@Module({
  imports: [
    NestTemporalClient.registerClientAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const temporalHost = config.temporalHost;
        const connection = await Connection.connect({
          address: temporalHost,
        });

        return {
          connection,
        };
      },
    }),
  ],
})
export class TemporalClientModule {}