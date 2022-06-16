import { registerAs } from '@nestjs/config';
import { AppConfigAdapter } from './app-config-adapter.dbs';

export const AppConfigRegistry = registerAs(
  'AppConfig',
  async () => new AppConfigAdapter(),
);
