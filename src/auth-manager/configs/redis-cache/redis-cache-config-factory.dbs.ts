import { ConfigService } from '@nestjs/config';

export function redisCacheConfigFactory(config: ConfigService) {
  return {
    host: config.get<string>('RedisCacheConfig.HOST'),
    port: config.get<number>('RedisCacheConfig.PORT'),
    ttl: config.get<number>('RedisCacheConfig.TTL'),
    max: config.get<number>('RedisCacheConfig.MAX'),
    db: config.get<number>('RedisCacheConfig.DB_INDEX'),
    password: config.get<string>('RedisCacheConfig.PASS'),
  };
}
