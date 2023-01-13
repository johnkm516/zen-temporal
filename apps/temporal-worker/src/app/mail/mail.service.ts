import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

import { ConfigService } from '../config';
import { GeneralContext } from './contexts';

type MailOptions = ISendMailOptions & { template?: string };

@Injectable()
export class MailService {
  constructor(
    private readonly mailer: MailerService,
    private readonly config: ConfigService
  ) {}
  //--------------------------------------------------------------------------
  async send(options: MailOptions) {
    Logger.log(`Sent ${options.template} ${options.to}`);
    try {
      return await this.mailer.sendMail(options);
    } catch (e) {
      return Logger.error(e, options);
    }
  }
  //--------------------------------------------------------------------------
  async sendGeneral(options: { to: string; subject: string; context: GeneralContext }) {
    return this.send({
      template: 'general',
      to: options.to,
      subject: options.subject,
      context: options.context,
    });
  }
  //--------------------------------------------------------------------------
}
