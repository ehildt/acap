import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

import {
  AppConfig,
  MongoConfig,
  RealmConfig,
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
    return Object.freeze<RealmConfig>({
      ttl: this.configService.get<number>('Realm.TTL'),
      namespacePostfix: this.configService.get<string>('Realm.NAMESPACE_POSTFIX'),
      resolveEnv: this.configService.get<boolean>('Realm.RESOLVE_ENV'),
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
      publishEvents: this.configService.get<boolean>('Publisher.EVENTS'),
      options: {
        port: this.configService.get<number>('Publisher.PORT'),
        host: this.configService.get<string>('Publisher.HOST'),
        password: this.configService.get<string>('Publisher.PASS'),
        username: this.configService.get<string>('Publisher.USER'),
      },
    });
  }
}
