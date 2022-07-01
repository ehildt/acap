import { registerAs } from '@nestjs/config';
import { CacheManagerConfigAdapter } from './adapter.dbt';

export const CacheManagerConfigRegistry = registerAs(
  'CacheManagerConfig',
  () => new CacheManagerConfigAdapter(),
);
