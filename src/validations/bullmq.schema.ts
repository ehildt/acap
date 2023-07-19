import Joi from 'joi';

import { CONFIG_YML } from '@/configs/config-yml/loader';

export const BULLMQ_SCHEMA = {
  BULLMQ_REDIS_HOST: CONFIG_YML?.bullMQConfig?.redis?.host
    ? Joi.string().default(CONFIG_YML.bullMQConfig.redis.host)
    : Joi.string().optional(),

  BULLMQ_REDIS_PASS: CONFIG_YML?.bullMQConfig?.redis?.password
    ? Joi.string().default(CONFIG_YML.bullMQConfig.redis.password)
    : Joi.string().optional(),

  BULLMQ_REDIS_USER: CONFIG_YML?.bullMQConfig?.redis?.username
    ? Joi.string().default(CONFIG_YML.bullMQConfig.redis.username)
    : Joi.string().optional(),

  BULLMQ_REDIS_PORT: CONFIG_YML?.bullMQConfig?.redis?.port
    ? Joi.number().default(CONFIG_YML.bullMQConfig.redis.port)
    : Joi.number().optional(),
};
