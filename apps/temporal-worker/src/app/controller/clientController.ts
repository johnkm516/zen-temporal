import { Controller, Get, Post } from '@nestjs/common';
import { Connection, WorkflowClient } from '@temporalio/client';
import { InjectTemporalClient } from 'nestjs-temporal';

@Controller()
export class TemporalClientController {
  constructor(
    @InjectTemporalClient() private readonly temporalClient: WorkflowClient,
  ) {}

  @Get()
  async greeting() {
    console.log("starting workflow");
    const handle = await this.temporalClient.start('example', {
      taskQueue: 'default',
      workflowId: 'wf-id-' + Math.floor(Math.random() * 1000),
    });
    console.log(`Started workflow ${handle.workflowId}`);
  }
}