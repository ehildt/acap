import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ManagerConfig, MongoConfig, PublisherConfig, RedisConfig } from './config-factory.modal';

@Injectable()
export class ConfigFactoryService {
  #mongoConfig: MongoConfig;
  #publisherConfig: PublisherConfig;
  #redisConfig: RedisConfig;
  #managerConfig: ManagerConfig;

  constructor(private readonly configService: ConfigService) {}

  get publisher() {
    if (this.#publisherConfig) return this.#publisherConfig;
    return (this.#publisherConfig = {
      transport: Transport.REDIS,
      options: {
        port: this.configService.get<number>('ConfigPublisher.PORT'),
        host: this.configService.get<string>('ConfigPublisher.HOST'),
      },
    });
  }

  get config() {
    if (this.#managerConfig) return this.#managerConfig;
    return (this.#managerConfig = {
      ttl: this.configService.get<number>('ManagerConfig.TTL'),
      namespacePrefix: this.configService.get<string>('ManagerConfig.NAMESPACE_PREFIX'),
    });
  }

  get mongo() {
    if (this.#mongoConfig) return this.#mongoConfig;
    return (this.#mongoConfig = {
      uri: this.configService.get<string>('MongoConfig.URI'),
      ssl: this.configService.get<boolean>('MongoConfig.SSL'),
      sslValidate: this.configService.get<boolean>('MongoConfig.SSL_VALIDATE'),
      dbName: this.configService.get<string>('MongoConfig.DB_NAME'),
      user: this.configService.get<string>('MongoConfig.USER'),
      pass: this.configService.get<string>('MongoConfig.PASS'),
    });
  }

  get redis() {
    if (this.#redisConfig) return this.#redisConfig;
    return (this.#redisConfig = {
      host: this.configService.get<string>('RedisConfig.HOST'),
      port: this.configService.get<number>('RedisConfig.PORT'),
      ttl: this.configService.get<number>('RedisConfig.TTL'),
      max: this.configService.get<number>('RedisConfig.MAX'),
      db: this.configService.get<number>('RedisConfig.DB_INDEX'),
      password: this.configService.get<string>('RedisConfig.PASS'),
    });
  }
}
