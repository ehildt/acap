import Joi from 'joi';

import { CONFIG_YML } from '@/configs/config-yml/loader';

export const MONGOOSE_SCHEMA = {
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
};
