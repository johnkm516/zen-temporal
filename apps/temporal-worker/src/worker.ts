import { 
  bundleWorkflowCode, 
  Worker,
  DefaultLogger,
  NativeConnection,
  Runtime, } from '@temporalio/worker';
import * as activities from './activities';

async function run() {
  const logger = new DefaultLogger('DEBUG');
  Runtime.install({
    logger,
    telemetryOptions: { tracingFilter: 'INFO' },
  });

  console.log("NODE ENV : " + process.env.NODE_ENV);
  const connection = await NativeConnection.connect(
    process.env.NODE_ENV === 'production'
      ? {
        address: 'production-temporal-hostname',
      } : {
        address: 'localhost:7233'
      }
  );
  const worker = await Worker.create({
    connection,
    namespace: 'default',
    workflowBundle: process.env.NODE_ENV === 'production'
      ? {
        codePath: './workflow-bundle.js',
      }
      : await bundleWorkflowCode({
        workflowsPath: require.resolve('./workflows'),
      }),
    activities,
    taskQueue: 'tutorial',
  });

  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
