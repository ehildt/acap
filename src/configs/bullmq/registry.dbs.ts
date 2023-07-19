import { registerAs } from '@nestjs/config';

import { BullMQAdapter } from './adapter.dbs';

export const BullMQRegistry = registerAs('BullMQ', async () => new BullMQAdapter());
