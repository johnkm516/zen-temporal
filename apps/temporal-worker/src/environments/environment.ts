import { EnvironmentBase } from './environment.base';

export const environment: EnvironmentBase = {
  production: false,
  temporalHost: 'localhost:7233',
  API_URL: process.env.API_URL,
  API_PASSWORD: process.env.API_PASSWORD,
  API_USERNAME: process.env.API_USERNAME,
  mail: {
    // Docs: https://nodemailer.com/smtp/
    transport: {
      host: process.env.SMTP_SERVER,
      port: 587,
      secureConnection: false, // true for port 465, false for other ports
      requireTLS: true,
      auth: {
        user: process.env.SMTP_LOGIN,
        pass: process.env.SMTP_PASSWORD,
      },
      logger: true,
      debug: true, 
    },
    defaults: {
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    },
  },
}