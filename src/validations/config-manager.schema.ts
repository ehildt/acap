import Joi from 'joi';

import { CONFIG_YML } from '@/configs/config-yml/loader';

export const CONFIG_MANAGER_SCHEMA = {
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
};
