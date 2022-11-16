import { Connection, WorkflowClient } from '@temporalio/client';

async function run() {
  const connection = await Connection.connect({
    address: 'localhost',
    tls: {}
  });

  const client = new WorkflowClient({
    connection,
    namespace: 'default',
  });

  const handle = await client.execute('example', {
    args: ['Temporal'],
    taskQueue: 'tutorial',
    workflowId: 'my-business-id-5',
  });

  console.log(`Started workflow ${handle.workflowId}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

console.log('here')
