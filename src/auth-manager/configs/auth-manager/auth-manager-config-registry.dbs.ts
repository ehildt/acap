import { registerAs } from '@nestjs/config';
import { AuthManagerConfigAdapter } from './auth-manager-config-adapter.dbs';

export const AuthManagerConfigRegistry = registerAs(
  'AuthManagerConfig',
  () => new AuthManagerConfigAdapter(),
);
