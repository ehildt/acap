import { registerAs } from '@nestjs/config';

import { RealmAdapter } from './adapter.dbt';

export const RealmRegistry = registerAs('Realm', () => new RealmAdapter());
