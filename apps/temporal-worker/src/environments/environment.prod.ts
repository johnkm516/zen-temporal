import { EnvironmentBase } from './environment.base';

export const environment: EnvironmentBase = {
  production: true,
  temporalHost: 'production-temporal-hostname',
  API_URL: process.env.API_URL,
  API_PASSWORD: process.env.API_PASSWORD,
  API_USERNAME: process.env.API_USERNAME
}