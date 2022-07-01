import { registerAs } from '@nestjs/config';
import { MongoConfigAdapter } from './adapter.dbs';

export const MongoConfigRegistry = registerAs(
  'MongoConfig',
  () => new MongoConfigAdapter(),
);
