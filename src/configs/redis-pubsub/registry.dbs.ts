import { registerAs } from '@nestjs/config';

import { RedisPubSubAdapter } from './adapter.dbs';

export const RedisPubSubRegistry = registerAs('RedisPubSub', async () => new RedisPubSubAdapter());
