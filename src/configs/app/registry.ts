import { registerAs } from '@nestjs/config';

import { AppConfigAdapter } from './adapter';

export const AppConfigRegistry = registerAs('AppConfig', async () => new AppConfigAdapter());
