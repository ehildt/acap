import Joi from 'joi';

import { APP_SCHEMA } from './app.schema';
import { REALM_SCHEMA } from './config-manager.schema';
import { MONGOOSE_SCHEMA } from './mongoose.schema';
import { REDIS_SCHEMA } from './redis.schema';
import { REDIS_PUBLISHER_SCHEMA } from './redis-publisher.schema';

export const validationSchema = Joi.object({
  ...APP_SCHEMA,
  ...REDIS_SCHEMA,
  ...MONGOOSE_SCHEMA,
  ...REALM_SCHEMA,
  ...REDIS_PUBLISHER_SCHEMA,
});
