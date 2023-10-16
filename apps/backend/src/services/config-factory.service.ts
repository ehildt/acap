import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

import {
  AppConfig,
  BullMQConfig,
  MongoConfig,
  RedisConfig,
  RedisPubSubConfig,
} from '@/configs/config-yml/config.model';
import { MqttClientOptions } from '@/modules/mqtt-client.module';

@Injectable()
export class ConfigFactoryService {
  constructor(private readonly configService: ConfigService) {}

  get app() {
    const symmetricKey = this.configService.get<string>('AppConfig.SYMMETRIC_KEY');
    const symmetricAlgorithm = this.configService.get<string>('AppConfig.SYMMETRIC_ALGORITHM');
    return Object.freeze<AppConfig>({
      port: this.configService.get<number>('AppConfig.PORT'),
      address: this.configService.get<string>('AppConfig.ADDRESS'),
      startSwagger: this.configService.get<boolean>('AppConfig.START_SWAGGER'),
      printEnv: this.configService.get<boolean>('AppConfig.PRINT_ENV'),
      nodeEnv: this.configService.get<string>('AppConfig.NODE_ENV'),
      crypto: {
        symmetricKey,
        symmetricAlgorithm,
        cryptable: Boolean(symmetricKey && symmetricAlgorithm),
      },
      realm: {
        ttl: this.configService.get<number>('AppConfig.TTL'),
        namespacePostfix: this.configService.get<string>('AppConfig.NAMESPACE_POSTFIX'),
        resolveEnv: this.configService.get<boolean>('AppConfig.RESOLVE_ENV'),
        gzipThreshold: this.configService.get<number>('AppConfig.GZIP_THRESHOLD'),
      },
      services: {
        useBullMQ: this.configService.get<boolean>('AppConfig.USE_BULLMQ'),
        useRedisPubSub: this.configService.get<boolean>('AppConfig.USE_REDIS_PUBSUB'),
        useMQTT: this.configService.get<boolean>('AppConfig.USE_MQTT'),
      },
    });
  }

  get mongo() {
    return Object.freeze<MongoConfig>({
      uri: this.configService.get<string>('MongoConfig.URI'),
      ssl: this.configService.get<boolean>('MongoConfig.SSL'),
      tlsAllowInvalidCertificates: this.configService.get<boolean>('MongoConfig.TLS_ALLOW_INVALID_CERTIFICATES'),
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
      connection: {
        port,
        host,
        password,
        username,
      },
    });
  }

  get mqtt() {
    return Object.freeze<MqttClientOptions>({
      brokerUrl: this.configService.get<string>('MQTTClientConfig.BROKER_URL'),
      options: {
        keepalive: this.configService.get<number>('MQTTClientConfig.KEEPALIVE'),
        connectTimeout: this.configService.get<number>('MQTTClientConfig.CONNECTION_TIMEOUT'),
        reconnectPeriod: this.configService.get<number>('MQTTClientConfig.RECONNECT_PERIOD'),
        resubscribe: this.configService.get<boolean>('MQTTClientConfig.RESUBSCRIBE'),
        protocol: this.configService.get<any>('MQTTClientConfig.PROTOCOL'),
        hostname: this.configService.get<string>('MQTTClientConfig.HOSTNAME'),
        port: this.configService.get<number>('MQTTClientConfig.PORT'),
        username: this.configService.get<string>('MQTTClientConfig.USERNAME'),
        password: this.configService.get<string>('MQTTClientConfig.PASSWORD'),
      },
    });
  }
}
