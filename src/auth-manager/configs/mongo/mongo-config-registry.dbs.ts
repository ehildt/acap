import { registerAs } from '@nestjs/config';
import { MongoConfigAdapter } from './mongo-config-adapter.dbs';

export const MongoConfigRegistry = registerAs(
  'MongoConfig',
  () => new MongoConfigAdapter(),
);
