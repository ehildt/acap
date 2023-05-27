import { registerAs } from '@nestjs/config';

import { AppConfigAdapter } from './adapter.dbs';

export const AppConfigRegistry = registerAs('AppConfig', async () => new AppConfigAdapter());
