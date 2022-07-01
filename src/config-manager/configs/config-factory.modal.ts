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

export interface ConfigManagerConfig {
  namespacePrefix: string;
  ttl: number;
}
