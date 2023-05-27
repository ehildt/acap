import Joi from 'joi';

import { CONFIG_YML } from '@/configs/config-yml/loader';

export const REDIS_PUBLISHER_SCHEMA = {
  REDIS_PUBLISHER_HOST: CONFIG_YML?.redisPublisherConfig?.options.host
    ? Joi.string().default(CONFIG_YML.redisPublisherConfig.options.host)
    : Joi.string().required(),

  REDIS_PUBLISHER_PASS: CONFIG_YML?.redisPublisherConfig?.options.password
    ? Joi.string().default(CONFIG_YML.redisPublisherConfig.options.password)
    : Joi.string().required(),

  REDIS_PUBLISHER_USER: CONFIG_YML?.redisPublisherConfig?.options.username
    ? Joi.string().default(CONFIG_YML.redisPublisherConfig.options.username)
    : Joi.string().required(),

  REDIS_PUBLISHER_PORT: CONFIG_YML?.redisPublisherConfig?.options.port
    ? Joi.number().default(CONFIG_YML.redisPublisherConfig.options.port)
    : Joi.number().required(),

  REDIS_PUBLISHER_PUBLISH_EVENTS:
    CONFIG_YML?.redisPublisherConfig?.publishEvents !== undefined
      ? Joi.boolean().default(CONFIG_YML.redisPublisherConfig?.publishEvents)
      : Joi.boolean().required(),
};
