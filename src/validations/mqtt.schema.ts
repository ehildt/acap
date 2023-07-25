import Joi from 'joi';

import { CONFIG_YML } from '@/configs/config-yml/loader';

export const MQTT_SCHEMA = {
  MQTT_HOSTNAME: CONFIG_YML?.mqttClientConfig?.hostname
    ? Joi.string().default(CONFIG_YML.mqttClientConfig.hostname)
    : Joi.string().required(),

  MQTT_PASSWORD: CONFIG_YML?.mqttClientConfig?.password
    ? Joi.string().default(CONFIG_YML.mqttClientConfig.password)
    : Joi.string().optional(),

  MQTT_USERNAME: CONFIG_YML?.mqttClientConfig?.username
    ? Joi.string().default(CONFIG_YML.mqttClientConfig.username)
    : Joi.string().optional(),

  MQTT_PROTOCOL: CONFIG_YML?.mqttClientConfig?.protocol
    ? Joi.string().default(CONFIG_YML.mqttClientConfig.protocol)
    : Joi.string().required(),

  MQTT_PORT: CONFIG_YML?.mqttClientConfig?.port
    ? Joi.number().default(CONFIG_YML.mqttClientConfig.port)
    : Joi.number().required(),

  MQTT_KEEPALIVE: CONFIG_YML?.mqttClientConfig?.keepalive
    ? Joi.number().default(CONFIG_YML.mqttClientConfig.keepalive)
    : Joi.number().optional(),

  MQTT_CONNECTION_TIMEOUT: CONFIG_YML?.mqttClientConfig?.connectTimeout
    ? Joi.number().default(CONFIG_YML.mqttClientConfig.connectTimeout)
    : Joi.number().optional(),

  MQTT_RECONNECT_PERIOD: CONFIG_YML?.mqttClientConfig?.reconnectPeriod
    ? Joi.number().default(CONFIG_YML.mqttClientConfig.reconnectPeriod)
    : Joi.number().optional(),

  MQTT_RESUBSCRIBE:
    CONFIG_YML?.mqttClientConfig?.resubscribe !== undefined
      ? Joi.boolean().default(CONFIG_YML.mqttClientConfig.resubscribe)
      : Joi.boolean().optional(),

  USE_MQTT: Joi.boolean().default(false),
};
