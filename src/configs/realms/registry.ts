import { registerAs } from '@nestjs/config';

import { RealmAdapter } from './adapter';

export const RealmRegistry = registerAs('Realm', () => new RealmAdapter());
