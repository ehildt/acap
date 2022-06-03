import { registerAs } from '@nestjs/config';
import { RedisCacheConfigAdapter } from './redis-cache-config-adapter.dbs';

export const RedisCacheConfigRegistry = registerAs(
  'RedisCacheConfig',
  () => new RedisCacheConfigAdapter(),
);
