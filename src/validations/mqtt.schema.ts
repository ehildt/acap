import Joi from 'joi';

import { CONFIG_YML } from '@/configs/config-yml/loader';

export const MQTT_SCHEMA = {
  MQTT_HOSTNAME: CONFIG_YML?.mqttClientConfig?.options.hostname
    ? Joi.string().default(CONFIG_YML.mqttClientConfig.options.hostname)
    : Joi.string().required(),

  MQTT_PASSWORD: CONFIG_YML?.mqttClientConfig?.options.password
    ? Joi.string().default(CONFIG_YML.mqttClientConfig.options.password)
    : Joi.string().optional(),

  MQTT_USERNAME: CONFIG_YML?.mqttClientConfig?.options.username
    ? Joi.string().default(CONFIG_YML.mqttClientConfig.options.username)
    : Joi.string().optional(),

  MQTT_PROTOCOL: CONFIG_YML?.mqttClientConfig?.options.protocol
    ? Joi.string().default(CONFIG_YML.mqttClientConfig.options.protocol)
    : Joi.string().required(),

  MQTT_BROKER_URL: CONFIG_YML?.mqttClientConfig?.brokerUrl
    ? Joi.string().default(CONFIG_YML.mqttClientConfig.brokerUrl)
    : Joi.string().optional(),

  MQTT_PORT: CONFIG_YML?.mqttClientConfig?.options.port
    ? Joi.number().default(CONFIG_YML.mqttClientConfig.options.port)
    : Joi.number().required(),

  MQTT_KEEPALIVE: CONFIG_YML?.mqttClientConfig?.options.keepalive
    ? Joi.number().default(CONFIG_YML.mqttClientConfig.options.keepalive)
    : Joi.number().optional(),

  MQTT_CONNECTION_TIMEOUT: CONFIG_YML?.mqttClientConfig?.options.connectTimeout
    ? Joi.number().default(CONFIG_YML.mqttClientConfig.options.connectTimeout)
    : Joi.number().optional(),

  MQTT_RECONNECT_PERIOD: CONFIG_YML?.mqttClientConfig?.options.reconnectPeriod
    ? Joi.number().default(CONFIG_YML.mqttClientConfig.options.reconnectPeriod)
    : Joi.number().optional(),

  MQTT_RESUBSCRIBE:
    CONFIG_YML?.mqttClientConfig?.options.resubscribe !== undefined
      ? Joi.boolean().default(CONFIG_YML.mqttClientConfig.options.resubscribe)
      : Joi.boolean().optional(),

  USE_MQTT:
    CONFIG_YML?.appConfig?.services.useMQTT !== undefined
      ? Joi.boolean().default(CONFIG_YML?.appConfig?.services.useMQTT)
      : Joi.boolean().default(false),
};
