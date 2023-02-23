import Joi from 'joi';

import { CONFIG_MANAGER_SCHEMA } from './config-manager.schema';
import { MONGOOSE_SCHEMA } from './mongoose.schema';
import { REDIS_SCHEMA } from './redis.schema';
import { REDIS_PUBLISHER_SCHEMA } from './redis-publisher.schema';

export const envValidationSchema = Joi.object({
  ...CONFIG_MANAGER_SCHEMA,
  ...MONGOOSE_SCHEMA,
  ...REDIS_SCHEMA,
  ...REDIS_PUBLISHER_SCHEMA,
});
