import { registerAs } from '@nestjs/config';

import { MongoConfigAdapter } from './adapter';

export const MongoConfigRegistry = registerAs('MongoConfig', () => new MongoConfigAdapter());
