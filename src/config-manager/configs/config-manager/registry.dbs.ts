import { registerAs } from '@nestjs/config';
import { ManagerConfigAdapter } from './adapter.dbt';

export const ConfigManagerRegistry = registerAs('ManagerConfig', () => new ManagerConfigAdapter());
