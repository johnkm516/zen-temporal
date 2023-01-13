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
    const handle = await this.temporalClient.start('mailTest', {
      taskQueue: 'default',
      workflowId: 'wf-id-SENDEMAIL' + Math.floor(Math.random() * 1000),
    });
  }
}