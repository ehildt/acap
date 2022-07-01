export interface RedisConfig {
  host: string;
  port: number;
  ttl: number;
  max: number;
  db: number;
  password: string;
}

export interface CacheManagerConfig {
  namespacePrefix: string;
  ttl: number;
}
