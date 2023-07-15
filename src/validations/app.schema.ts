import Joi from 'joi';

import { CONFIG_YML } from '@/configs/config-yml/loader';

export const APP_SCHEMA = {
  PORT: CONFIG_YML?.appConfig?.port ? Joi.number().default(CONFIG_YML.appConfig.port) : Joi.number().required(),

  ADDRESS: CONFIG_YML?.appConfig?.address
    ? Joi.string().default(CONFIG_YML.appConfig.address)
    : Joi.string().required(),

  PRINT_ENV:
    CONFIG_YML?.appConfig?.printEnv !== undefined
      ? Joi.boolean().default(CONFIG_YML.appConfig.printEnv)
      : Joi.boolean().required(),

  START_SWAGGER:
    CONFIG_YML?.appConfig?.startSwagger !== undefined
      ? Joi.boolean().default(CONFIG_YML.appConfig.startSwagger)
      : Joi.boolean().required(),

  NODE_ENV: CONFIG_YML?.appConfig?.nodeEnv
    ? Joi.string().default(CONFIG_YML.appConfig.nodeEnv)
    : Joi.string().required(),
};
