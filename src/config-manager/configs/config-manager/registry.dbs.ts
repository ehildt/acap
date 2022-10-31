import { registerAs } from '@nestjs/config';
import { ConfigManagerAdapter } from './adapter.dbt';

export const ConfigManagerRegistry = registerAs('ConfigManager', () => new ConfigManagerAdapter());
