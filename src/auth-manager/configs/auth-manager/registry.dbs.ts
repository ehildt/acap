import { registerAs } from '@nestjs/config';
import { AuthManagerConfigAdapter } from './adapter.dbs';

export const AuthManagerConfigRegistry = registerAs(
  'AuthManagerConfig',
  () => new AuthManagerConfigAdapter(),
);
