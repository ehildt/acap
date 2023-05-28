import { registerAs } from '@nestjs/config';

import { ManagerAdapter } from './adapter.dbt';

export const ManagerRegistry = registerAs('Manager', () => new ManagerAdapter());
