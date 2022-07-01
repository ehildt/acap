import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheManagerConfig, RedisConfig } from './config-factory.modal';

@Injectable()
export class ConfigFactoryService {
  #redisConfig: RedisConfig;
  #cacheConfig: CacheManagerConfig;

  constructor(private readonly configService: ConfigService) {}

  get cache() {
    if (this.#cacheConfig) return this.#cacheConfig;
    return (this.#cacheConfig = <CacheManagerConfig>{
      ttl: this.configService.get<number>('CacheManagerConfig.TTL'),
      namespacePrefix: this.configService.get<string>(
        'CacheManagerConfig.NAMESPACE_PREFIX',
      ),
    });
  }

  get redis() {
    if (this.#redisConfig) return this.#redisConfig;
    return (this.#redisConfig = <RedisConfig>{
      host: this.configService.get<string>('RedisConfig.HOST'),
      port: this.configService.get<number>('RedisConfig.PORT'),
      ttl: this.configService.get<number>('RedisConfig.TTL'),
      max: this.configService.get<number>('RedisConfig.MAX'),
      db: this.configService.get<number>('RedisConfig.DB_INDEX'),
      password: this.configService.get<string>('RedisConfig.PASS'),
    });
  }
}
