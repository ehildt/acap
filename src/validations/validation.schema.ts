import Joi from 'joi';

import { APP_SCHEMA } from './app.schema';
import { BULLMQ_SCHEMA } from './bullmq.schema';
import { MONGOOSE_SCHEMA } from './mongoose.schema';
import { REALM_SCHEMA } from './realm.schema';
import { REDIS_SCHEMA } from './redis.schema';
import { REDIS_PUBSUB_SCHEMA } from './redis-pubsub.schema';

export const validationSchema = Joi.object({
  ...APP_SCHEMA,
  ...REDIS_SCHEMA,
  ...MONGOOSE_SCHEMA,
  ...REALM_SCHEMA,
  ...REDIS_PUBSUB_SCHEMA,
  ...BULLMQ_SCHEMA,
});
