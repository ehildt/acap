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

export interface ManagerConfig {
  namespacePrefix: string;
  ttl: number;
}

export interface PublisherConfig {
  transport: number;
  options: {
    port: number;
    host: string;
  };
}
