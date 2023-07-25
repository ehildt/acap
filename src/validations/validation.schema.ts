import Joi from 'joi';

import { APP_SCHEMA } from './app.schema';
import { BULLMQ_SCHEMA } from './bullmq.schema';
import { MONGOOSE_SCHEMA } from './mongoose.schema';
import { MQTT_SCHEMA } from './mqtt.schema';
import { REDIS_SCHEMA } from './redis.schema';
import { REDIS_PUBSUB_SCHEMA } from './redis-pubsub.schema';

export const validationSchema = Joi.object({
  ...APP_SCHEMA,
  ...REDIS_SCHEMA,
  ...MONGOOSE_SCHEMA,
  ...REDIS_PUBSUB_SCHEMA,
  ...BULLMQ_SCHEMA,
  ...MQTT_SCHEMA,
});
