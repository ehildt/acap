import Joi from 'joi';

import { CONFIG_YML } from '@/configs/config-yml/loader';

export const REDIS_PUBSUB_SCHEMA = {
  REDIS_PUBSUB_HOST: CONFIG_YML?.redisPubSubConfig?.options.host
    ? Joi.string().default(CONFIG_YML.redisPubSubConfig.options.host)
    : Joi.string().required(),

  REDIS_PUBSUB_PASS: CONFIG_YML?.redisPubSubConfig?.options.password
    ? Joi.string().default(CONFIG_YML.redisPubSubConfig.options.password)
    : Joi.string().required(),

  REDIS_PUBSUB_USER: CONFIG_YML?.redisPubSubConfig?.options.username
    ? Joi.string().default(CONFIG_YML.redisPubSubConfig.options.username)
    : Joi.string().required(),

  REDIS_PUBSUB_PORT: CONFIG_YML?.redisPubSubConfig?.options.port
    ? Joi.number().default(CONFIG_YML.redisPubSubConfig.options.port)
    : Joi.number().required(),

  REDIS_PUBSUB_PUBLISH_EVENTS:
    CONFIG_YML?.redisPubSubConfig?.publishEvents !== undefined
      ? Joi.boolean().default(CONFIG_YML.redisPubSubConfig?.publishEvents)
      : Joi.boolean().required(),
};
