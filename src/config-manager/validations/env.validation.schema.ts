import Joi from 'joi';

import { CONFIG_YML } from '@/config.yml.loader';

export const envValidationSchema = Joi.object({
  CONFIG_MANAGER_NAMESPACE_POSTFIX: CONFIG_YML?.managerConfig?.namespacePostfix
    ? Joi.string().default(CONFIG_YML.managerConfig?.namespacePostfix)
    : Joi.string().required(),

  CONFIG_MANAGER_RESOLVE_ENV:
    CONFIG_YML?.managerConfig?.resolveEnv !== undefined
      ? Joi.boolean().default(CONFIG_YML.managerConfig?.resolveEnv)
      : Joi.boolean().required(),

  CONFIG_MANAGER_TTL:
    CONFIG_YML?.managerConfig?.ttl !== undefined
      ? Joi.number().default(CONFIG_YML.managerConfig.ttl)
      : Joi.number().required(),

  MONGO_SSL:
    CONFIG_YML?.mongoConfig?.ssl !== undefined
      ? Joi.boolean().default(CONFIG_YML.mongoConfig.ssl)
      : Joi.boolean().required(),

  MONGO_SSL_VALIDATE:
    CONFIG_YML?.mongoConfig?.sslValidate !== undefined
      ? Joi.boolean().default(CONFIG_YML.mongoConfig.sslValidate)
      : Joi.boolean().required(),

  MONGO_USER: CONFIG_YML?.mongoConfig?.user
    ? Joi.string().default(CONFIG_YML.mongoConfig.user)
    : Joi.string().required(),

  MONGO_PASS: CONFIG_YML?.mongoConfig?.pass
    ? Joi.string().default(CONFIG_YML.mongoConfig.pass)
    : Joi.string().required(),

  MONGO_DB_NAME: CONFIG_YML?.mongoConfig?.dbName
    ? Joi.string().default(CONFIG_YML.mongoConfig.dbName)
    : Joi.string().required(),

  MONGO_URI: CONFIG_YML?.mongoConfig?.uri ? Joi.string().default(CONFIG_YML.mongoConfig.uri) : Joi.string().required(),

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
});
