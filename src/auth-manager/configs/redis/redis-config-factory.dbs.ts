import { ConfigService } from '@nestjs/config';

export function redisConfigFactory(config: ConfigService) {
  return {
    host: config.get<string>('RedisConfig.HOST'),
    port: config.get<number>('RedisConfig.PORT'),
    ttl: config.get<number>('RedisConfig.TTL'),
    max: config.get<number>('RedisConfig.MAX'),
    db: config.get<number>('RedisConfig.DB_INDEX'),
    password: config.get<string>('RedisConfig.PASS'),
  };
}
