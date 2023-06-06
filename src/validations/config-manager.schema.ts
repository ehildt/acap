import Joi from 'joi';

import { CONFIG_YML } from '@/configs/config-yml/loader';

export const REALM_SCHEMA = {
  REALM_NAMESPACE_POSTFIX: CONFIG_YML?.realmConfig?.namespacePostfix
    ? Joi.string().default(CONFIG_YML.realmConfig?.namespacePostfix)
    : Joi.string().required(),

  REALM_RESOLVE_ENV:
    CONFIG_YML?.realmConfig?.resolveEnv !== undefined
      ? Joi.boolean().default(CONFIG_YML.realmConfig?.resolveEnv)
      : Joi.boolean().required(),

  REALM_TTL:
    CONFIG_YML?.realmConfig?.ttl !== undefined
      ? Joi.number().default(CONFIG_YML.realmConfig.ttl)
      : Joi.number().required(),
};
