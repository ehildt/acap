import { registerAs } from '@nestjs/config';
import { ConfigManagerConfigAdapter } from './adapter.dbt';

export const ConfigManagerRegistry = registerAs(
  'ConfigManagerConfig',
  () => new ConfigManagerConfigAdapter(),
);
