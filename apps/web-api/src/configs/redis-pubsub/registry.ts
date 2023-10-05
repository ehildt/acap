import { registerAs } from '@nestjs/config';

import { RedisPubSubAdapter } from './adapter';

export const RedisPubSubRegistry = registerAs('RedisPubSub', async () => new RedisPubSubAdapter());
