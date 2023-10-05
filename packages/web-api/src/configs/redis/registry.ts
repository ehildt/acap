import { registerAs } from '@nestjs/config';

import { RedisConfigAdapter } from './adapter';

export const RedisConfigRegistry = registerAs('RedisConfig', () => new RedisConfigAdapter());
