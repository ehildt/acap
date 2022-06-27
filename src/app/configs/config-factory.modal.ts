export interface AuthManagerConfig {
  username: string;
  password: string;
  accessTokenTTL: number;
  refreshTokenTTL: number;
  tokenSecret: string;
  configManagerBaseUrl: string;
  email: string;
  consumerToken: string;
}

export interface MongoConfig {
  uri: string;
  ssl: boolean;
  sslValidate: boolean;
  dbName: string;
  user: string;
  pass: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  ttl: number;
  max: number;
  db: number;
  password: string;
}

export interface AppConfig {
  nodeEnv: string;
  port: string;
  host: string;
  startSwagger: boolean;
  httpProtocol: string;
}
