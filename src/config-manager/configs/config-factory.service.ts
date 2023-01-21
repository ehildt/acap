import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

import { ManagerConfig, MongoConfig, RedisConfig, RedisPublisherConfig } from '@/config.yml.modal';

@Injectable()
export class ConfigFactoryService {
  #mongoConfig: MongoConfig;
  #publisherConfig: RedisPublisherConfig;
  #redisConfig: RedisConfig;
  #managerConfig: ManagerConfig;

  constructor(private readonly configService: ConfigService) {}

  get publisher() {
    if (this.#publisherConfig) return this.#publisherConfig;
    return (this.#publisherConfig = Object.freeze({
      transport: Transport.REDIS,
      publishEvents: this.configService.get<boolean>('ConfigPublisher.EVENTS'),
      options: {
        port: this.configService.get<number>('ConfigPublisher.PORT'),
        host: this.configService.get<string>('ConfigPublisher.HOST'),
        password: this.configService.get<string>('ConfigPublisher.PASS'),
        username: this.configService.get<string>('ConfigPublisher.USER'),
      },
    }));
  }

  get config() {
    if (this.#managerConfig) return this.#managerConfig;
    return (this.#managerConfig = Object.freeze({
      ttl: this.configService.get<number>('ConfigManager.TTL'),
      namespacePostfix: this.configService.get<string>('ConfigManager.NAMESPACE_POSTFIX'),
      resolveEnv: this.configService.get<boolean>('ConfigManager.RESOLVE_ENV'),
    }));
  }

  get mongo() {
    if (this.#mongoConfig) return this.#mongoConfig;
    return (this.#mongoConfig = Object.freeze({
      uri: this.configService.get<string>('MongoConfig.URI'),
      ssl: this.configService.get<boolean>('MongoConfig.SSL'),
      sslValidate: this.configService.get<boolean>('MongoConfig.SSL_VALIDATE'),
      dbName: this.configService.get<string>('MongoConfig.DB_NAME'),
      user: this.configService.get<string>('MongoConfig.USER'),
      pass: this.configService.get<string>('MongoConfig.PASS'),
    }));
  }

  get redis() {
    if (this.#redisConfig) return this.#redisConfig;
    return (this.#redisConfig = Object.freeze({
      host: this.configService.get<string>('RedisConfig.HOST'),
      port: this.configService.get<number>('RedisConfig.PORT'),
      ttl: this.configService.get<number>('RedisConfig.TTL'),
      max: this.configService.get<number>('RedisConfig.MAX'),
      db: this.configService.get<number>('RedisConfig.DB_INDEX'),
      password: this.configService.get<string>('RedisConfig.PASS'),
      username: this.configService.get<string>('RedisConfig.USER'),
    }));
  }
}
