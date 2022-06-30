import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoConfig, RedisConfig } from './config-factory.modal';

@Injectable()
export class ConfigFactoryService {
  #mongoConfig: MongoConfig;
  #redisConfig: RedisConfig;

  constructor(private readonly configService: ConfigService) {}

  get mongo() {
    if (this.#mongoConfig) return this.#mongoConfig;
    return (this.#mongoConfig = <MongoConfig>{
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
