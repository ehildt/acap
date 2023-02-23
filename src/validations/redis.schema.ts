import Joi from 'joi';

import { CONFIG_YML } from '@/configs/config-yml/loader';

export const REDIS_SCHEMA = {
  REDIS_TTL: CONFIG_YML?.redisConfig?.ttl ? Joi.number().default(CONFIG_YML.redisConfig.ttl) : Joi.number().required(),

  REDIS_MAX_RESPONSES: CONFIG_YML?.redisConfig?.max
    ? Joi.number().default(CONFIG_YML.redisConfig.max)
    : Joi.number().required(),

  REDIS_HOST: CONFIG_YML?.redisConfig?.host
    ? Joi.string().default(CONFIG_YML.redisConfig.host)
    : Joi.string().required(),

  REDIS_PASS: CONFIG_YML?.redisConfig?.password
    ? Joi.string().default(CONFIG_YML.redisConfig.password)
    : Joi.string().optional(),

  REDIS_USER: CONFIG_YML?.redisConfig?.username
    ? Joi.string().default(CONFIG_YML.redisConfig.username)
    : Joi.string().optional(),

  REDIS_PORT: CONFIG_YML?.redisConfig?.port
    ? Joi.number().default(CONFIG_YML.redisConfig.port)
    : Joi.number().required(),

  REDIS_DB_INDEX:
    CONFIG_YML?.redisConfig?.db !== undefined
      ? Joi.number().default(CONFIG_YML.redisConfig.db)
      : Joi.number().required(),
};
