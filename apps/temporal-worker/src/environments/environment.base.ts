import { MailerOptions } from '@nestjs-modules/mailer';

export abstract class EnvironmentBase {
  readonly production: boolean;
  readonly temporalHost: string;
  readonly API_URL: string;
  readonly API_PASSWORD: string;
  readonly API_USERNAME: string;
  readonly mail: Omit<MailerOptions, 'template'>;
}
