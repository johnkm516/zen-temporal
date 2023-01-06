import { Connection, WorkflowClient } from '@temporalio/client';

async function run() {
  const connection = await Connection.connect({
    address: 'localhost:7233'
  });

  const client = new WorkflowClient({
    connection,
    namespace: 'default',
  });


  const handle = await client.execute('example', {
    args: ['Temporal'],
    taskQueue: 'tutorial',
    workflowId: 'helloWorld',
    searchAttributes: {
      CustomStringField: [
        'au1052 helloWorld 091823 123456',
      ],
    },
  });

  console.log(`Started workflow ${handle}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

console.log('here')
