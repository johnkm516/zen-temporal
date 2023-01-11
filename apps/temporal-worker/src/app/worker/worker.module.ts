import { Global, Module } from '@nestjs/common';

import { TemporalModule as NestTemporalWorker } from 'nestjs-temporal';
import { NativeConnection, Runtime, DefaultLogger, bundleWorkflowCode } from '@temporalio/worker';
import * as path from 'path';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { ActivitiesModule } from '../activities/activities.module';

const logger = new DefaultLogger('DEBUG', ({ level, message }) => {
    console.log(`Custom logger: ${level} — ${message}`);
  });

@Global()
@Module({
  imports: [
    NestTemporalWorker.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        Runtime.install({logger});
        const temporalHost = config.temporalHost;
        const connection = await NativeConnection.connect({
          address: temporalHost,
        });
        
        return {
          connection,
          taskQueue: 'default',
          workflowBundle: {
            codePath: path.join(__dirname, './workflow-bundle.js')
          }
        };
      },
    }),
    ActivitiesModule
  ],
})
export class TemporalWorkerModule {}
