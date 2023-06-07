import { Transport } from '@nestjs/microservices';

export interface AppConfig {
  port: number;
  address: string;
  printEnv: boolean;
  startSwagger: boolean;
}

export interface RealmConfig {
  namespacePostfix: string;
  resolveEnv: boolean;
  ttl: number;
}

export interface MongoConfig {
  uri: string;
  dbName: string;
  user: string;
  pass: string;
  ssl: boolean;
  sslValidate: boolean;
}

export interface RedisPublisherConfig {
  transport: Transport.REDIS;
  publishEvents: boolean;
  options: {
    port: number;
    host: string;
    password: string;
    username: string;
  };
}

export interface RedisConfig {
  db: number;
  host: string;
  port: number;
  password: string;
  username: string;
  ttl: number;
  max: number;
}

export interface Config {
  appConfig: AppConfig;
  mongoConfig: MongoConfig;
  redisConfig: RedisConfig;
  realmConfig: RealmConfig;
  redisPublisherConfig: RedisPublisherConfig;
}
