import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

import {
  AppConfig,
  ManagerConfig,
  MongoConfig,
  RedisConfig,
  RedisPublisherConfig,
} from '@/configs/config-yml/config.modal';

@Injectable()
export class ConfigFactoryService {
  constructor(private readonly configService: ConfigService) {}

  get app() {
    return Object.freeze<AppConfig>({
      port: this.configService.get<number>('AppConfig.PORT'),
      startSwagger: this.configService.get<boolean>('AppConfig.START_SWAGGER'),
      printEnv: this.configService.get<boolean>('AppConfig.PRINT_ENV'),
    });
  }

  get config() {
    return Object.freeze<ManagerConfig>({
      ttl: this.configService.get<number>('ConfigManager.TTL'),
      namespacePostfix: this.configService.get<string>('ConfigManager.NAMESPACE_POSTFIX'),
      resolveEnv: this.configService.get<boolean>('ConfigManager.RESOLVE_ENV'),
    });
  }

  get mongo() {
    return Object.freeze<MongoConfig>({
      uri: this.configService.get<string>('MongoConfig.URI'),
      ssl: this.configService.get<boolean>('MongoConfig.SSL'),
      sslValidate: this.configService.get<boolean>('MongoConfig.SSL_VALIDATE'),
      dbName: this.configService.get<string>('MongoConfig.DB_NAME'),
      user: this.configService.get<string>('MongoConfig.USER'),
      pass: this.configService.get<string>('MongoConfig.PASS'),
    });
  }

  get redis() {
    return Object.freeze<RedisConfig>({
      host: this.configService.get<string>('RedisConfig.HOST'),
      port: this.configService.get<number>('RedisConfig.PORT'),
      ttl: this.configService.get<number>('RedisConfig.TTL'),
      max: this.configService.get<number>('RedisConfig.MAX'),
      db: this.configService.get<number>('RedisConfig.DB_INDEX'),
      password: this.configService.get<string>('RedisConfig.PASS'),
      username: this.configService.get<string>('RedisConfig.USER'),
    });
  }

  get publisher() {
    return Object.freeze<RedisPublisherConfig>({
      transport: Transport.REDIS,
      publishEvents: this.configService.get<boolean>('ConfigPublisher.EVENTS'),
      options: {
        port: this.configService.get<number>('ConfigPublisher.PORT'),
        host: this.configService.get<string>('ConfigPublisher.HOST'),
        password: this.configService.get<string>('ConfigPublisher.PASS'),
        username: this.configService.get<string>('ConfigPublisher.USER'),
      },
    });
  }
}
