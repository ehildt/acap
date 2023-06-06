import { registerAs } from '@nestjs/config';

import { PublisherAdapter } from './adapter.dbs';

export const PublisherRegistry = registerAs('Publisher', async () => new PublisherAdapter());
