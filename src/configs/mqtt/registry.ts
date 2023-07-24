import { registerAs } from '@nestjs/config';

import { MQTTClientAdapter } from './adapter';

export const MQTTClientRegistry = registerAs('MQTTClientConfig', () => new MQTTClientAdapter());
