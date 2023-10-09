import { registerAs } from '@nestjs/config';

import { BullMQAdapter } from './adapter';

export const BullMQRegistry = registerAs('BullMQ', async () => new BullMQAdapter());
