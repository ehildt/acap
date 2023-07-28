export class MQTTClientAdapter {
  get KEEPALIVE(): number {
    return parseInt(process.env.MQTT_KEEPALIVE, 10);
  }

  get CONNECTION_TIMEOUT(): number {
    return parseInt(process.env.MQTT_CONNECTION_TIMEOUT, 10);
  }

  get RECONNECT_PERIOD(): number {
    return parseInt(process.env.MQTT_RECONNECT_PERIOD, 10);
  }

  get PORT(): number {
    return parseInt(process.env.MQTT_PORT, 10);
  }

  get RESUBSCRIBE(): boolean {
    return process.env.MQTT_RESUBSCRIBE === 'true';
  }

  get BROKER_URL(): string {
    return process.env.MQTT_BROKER_URL;
  }

  get PROTOCOL(): string {
    return process.env.MQTT_PROTOCOL;
  }

  get HOSTNAME(): string {
    return process.env.MQTT_HOSTNAME;
  }

  get USERNAME(): string {
    return process.env.MQTT_USERNAME;
  }

  get PASSWORD(): string {
    return process.env.MQTT_PASSWORD;
  }
}
