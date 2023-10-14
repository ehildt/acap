import Joi from 'joi';

import { CONFIG_YML } from '@/configs/config-yml/loader';

export const REDIS_PUBSUB_SCHEMA = {
  REDIS_PUBSUB_HOST: CONFIG_YML?.redisPubSubConfig?.options.host
    ? Joi.string().default(CONFIG_YML.redisPubSubConfig.options.host)
    : Joi.string().optional(),

  REDIS_PUBSUB_PASS: CONFIG_YML?.redisPubSubConfig?.options.password
    ? Joi.string().default(CONFIG_YML.redisPubSubConfig.options.password)
    : Joi.string().optional(),

  REDIS_PUBSUB_USER: CONFIG_YML?.redisPubSubConfig?.options.username
    ? Joi.string().default(CONFIG_YML.redisPubSubConfig.options.username)
    : Joi.string().optional(),

  REDIS_PUBSUB_PORT: CONFIG_YML?.redisPubSubConfig?.options.port
    ? Joi.number().default(CONFIG_YML.redisPubSubConfig.options.port)
    : Joi.number().optional(),
};
