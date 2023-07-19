import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

import {
  AppConfig,
  BullMQConfig,
  MongoConfig,
  RealmConfig,
  RedisConfig,
  RedisPubSubConfig,
} from '@/configs/config-yml/config.modal';

@Injectable()
export class ConfigFactoryService {
  constructor(private readonly configService: ConfigService) {}

  get app() {
    return Object.freeze<AppConfig>({
      port: this.configService.get<number>('AppConfig.PORT'),
      address: this.configService.get<string>('AppConfig.ADDRESS'),
      startSwagger: this.configService.get<boolean>('AppConfig.START_SWAGGER'),
      printEnv: this.configService.get<boolean>('AppConfig.PRINT_ENV'),
      nodeEnv: this.configService.get<string>('AppConfig.NODE_ENV'),
    });
  }

  get config() {
    return Object.freeze<RealmConfig>({
      ttl: this.configService.get<number>('Realm.TTL'),
      namespacePostfix: this.configService.get<string>('Realm.NAMESPACE_POSTFIX'),
      resolveEnv: this.configService.get<boolean>('Realm.RESOLVE_ENV'),
      gzipThreshold: this.configService.get<number>('Realm.GZIP_THRESHOLD'),
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

  get redisPubSub() {
    const port = this.configService.get<number>('RedisPubSub.PORT');
    const host = this.configService.get<string>('RedisPubSub.HOST');
    const password = this.configService.get<string>('RedisPubSub.PASS');
    const username = this.configService.get<string>('RedisPubSub.USER');
    return Object.freeze<RedisPubSubConfig>({
      transport: Transport.REDIS,
      isUsed: Boolean(port && host && password && username),
      options: {
        port,
        host,
        password,
        username,
      },
    });
  }

  get bullMQ() {
    const port = this.configService.get<number>('BullMQ.PORT');
    const host = this.configService.get<string>('BullMQ.HOST');
    const password = this.configService.get<string>('BullMQ.PASS');
    const username = this.configService.get<string>('BullMQ.USER');
    return Object.freeze<BullMQConfig>({
      isUsed: Boolean(port && host && password && username),
      redis: {
        port,
        host,
        password,
        username,
      },
    });
  }
}
