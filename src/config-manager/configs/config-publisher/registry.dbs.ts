import { registerAs } from '@nestjs/config';

import { ConfigPublisherAdapter } from './adapter.dbs';

export const ConfigPublisherRegistry = registerAs('ConfigPublisher', async () => new ConfigPublisherAdapter());
