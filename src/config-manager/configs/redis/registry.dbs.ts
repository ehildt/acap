import { registerAs } from '@nestjs/config';
import { RedisConfigAdapter } from './adapter.dbs';

export const RedisConfigRegistry = registerAs(
  'RedisConfig',
  () => new RedisConfigAdapter(),
);
