import Joi from 'joi';

import { CONFIG_YML } from '@/configs/config-yml/loader';

export const BULLMQ_SCHEMA = {
  BULLMQ_REDIS_HOST: CONFIG_YML?.bullMQConfig?.connection?.host
    ? Joi.string().default(CONFIG_YML.bullMQConfig.connection.host)
    : Joi.string().optional(),

  BULLMQ_REDIS_PASS: CONFIG_YML?.bullMQConfig?.connection?.password
    ? Joi.string().default(CONFIG_YML.bullMQConfig.connection.password)
    : Joi.string().optional(),

  BULLMQ_REDIS_USER: CONFIG_YML?.bullMQConfig?.connection?.username
    ? Joi.string().default(CONFIG_YML.bullMQConfig.connection.username)
    : Joi.string().optional(),

  BULLMQ_REDIS_PORT: CONFIG_YML?.bullMQConfig?.connection?.port
    ? Joi.number().default(CONFIG_YML.bullMQConfig.connection.port)
    : Joi.number().optional(),
};
