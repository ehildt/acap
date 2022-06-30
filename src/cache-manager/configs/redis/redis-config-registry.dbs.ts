import { registerAs } from '@nestjs/config';
import { RedisConfigAdapter } from './redis-config-adapter.dbs';

export const RedisConfigRegistry = registerAs(
  'RedisConfig',
  () => new RedisConfigAdapter(),
);
