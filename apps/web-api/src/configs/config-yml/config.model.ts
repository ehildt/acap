import { Transport } from '@nestjs/microservices';

import { MqttClientOptions } from '@/modules/mqtt-client.module';

export type AppConfigServices = {
  useBullMQ: boolean;
  useRedisPubSub: boolean;
  useMQTT: boolean;
};

export type AppConfig = {
  port: number;
  nodeEnv: string;
  address: string;
  printEnv: boolean;
  startSwagger: boolean;
  crypto: {
    symmetricKey: string;
    symmetricAlgorithm: string;
    cryptable: boolean;
  };
  realm: {
    gzipThreshold: number;
    namespacePostfix: string;
    resolveEnv: boolean;
    ttl: number;
  };
  services: AppConfigServices;
};

export type MongoConfig = {
  uri: string;
  dbName: string;
  user: string;
  pass: string;
  ssl: boolean;
  tlsAllowInvalidCertificates: boolean;
};

export type RedisPubSubConfig = {
  transport: Transport.REDIS;
  options: {
    port: number;
    host: string;
    password: string;
    username: string;
  };
};

export type BullMQConfig = {
  connection: {
    port: number;
    host: string;
    password: string;
    username: string;
  };
};

export type RedisConfig = {
  db: number;
  host: string;
  port: number;
  password: string;
  username: string;
  ttl: number;
  max: number;
};

export type Config = {
  appConfig: AppConfig;
  mongoConfig: MongoConfig;
  redisConfig: RedisConfig;
  redisPubSubConfig: RedisPubSubConfig;
  bullMQConfig: BullMQConfig;
  mqttClientConfig: MqttClientOptions;
};