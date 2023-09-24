/* eslint-disable sonarjs/cognitive-complexity */
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigFactoryService } from './config-factory.service';

describe('ConfigFactoryService', () => {
  let service: ConfigFactoryService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigFactoryService, ConfigService],
    }).compile();

    service = module.get<ConfigFactoryService>(ConfigFactoryService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('app', () => {
    it('should return a valid AppConfig object', () => {
      jest.spyOn(configService, 'get').mockImplementation((key) => {
        if (key === 'AppConfig.PORT') return 3000;
        if (key === 'AppConfig.ADDRESS') return 'localhost';
        if (key === 'AppConfig.START_SWAGGER') return true;
        if (key === 'AppConfig.PRINT_ENV') return true;
        if (key === 'AppConfig.NODE_ENV') return 'production';
        if (key === 'AppConfig.SYMMETRIC_KEY') return 'my-secret-key';
        if (key === 'AppConfig.SYMMETRIC_ALGORITHM') return 'AES-256-CBC';
        if (key === 'AppConfig.TTL') return 3600;
        if (key === 'AppConfig.NAMESPACE_POSTFIX') return 'prod';
        if (key === 'AppConfig.RESOLVE_ENV') return true;
        if (key === 'AppConfig.GZIP_THRESHOLD') return 1024;
        if (key === 'AppConfig.USE_BULLMQ') return true;
        if (key === 'AppConfig.USE_REDIS_PUBSUB') return true;
        if (key === 'AppConfig.USE_MQTT') return true;
        return null;
      });

      expect(service.app).toEqual({
        port: 3000,
        address: 'localhost',
        startSwagger: true,
        printEnv: true,
        nodeEnv: 'production',
        crypto: {
          symmetricKey: 'my-secret-key',
          symmetricAlgorithm: 'AES-256-CBC',
          cryptable: true,
        },
        realm: {
          ttl: 3600,
          namespacePostfix: 'prod',
          resolveEnv: true,
          gzipThreshold: 1024,
        },
        services: {
          useBullMQ: true,
          useRedisPubSub: true,
          useMQTT: true,
        },
      });
    });
  });

  describe('mongo', () => {
    it('should return a valid MongoConfig object', () => {
      jest.spyOn(configService, 'get').mockImplementation((key) => {
        if (key === 'MongoConfig.URI') return 'mongodb://localhost:27017/mydatabase';
        if (key === 'MongoConfig.SSL') return true;
        if (key === 'MongoConfig.TLS_ALLOW_INVALID_CERTIFICATES') return true;
        if (key === 'MongoConfig.DB_NAME') return 'mydatabase';
        if (key === 'MongoConfig.USER') return 'myuser';
        if (key === 'MongoConfig.PASS') return 'mypassword';
        return null;
      });

      expect(service.mongo).toEqual({
        uri: 'mongodb://localhost:27017/mydatabase',
        ssl: true,
        tlsAllowInvalidCertificates: true,
        dbName: 'mydatabase',
        user: 'myuser',
        pass: 'mypassword',
      });
    });
  });

  describe('redis', () => {
    it('should return a valid RedisConfig object', () => {
      jest.spyOn(configService, 'get').mockImplementation((key) => {
        if (key === 'RedisConfig.HOST') return 'localhost';
        if (key === 'RedisConfig.PORT') return 6379;
        if (key === 'RedisConfig.TTL') return 3600;
        if (key === 'RedisConfig.MAX') return 100;
        if (key === 'RedisConfig.DB_INDEX') return 0;
        if (key === 'RedisConfig.PASS') return 'redispassword';
        if (key === 'RedisConfig.USER') return 'redisuser';
        return null;
      });

      expect(service.redis).toEqual({
        host: 'localhost',
        port: 6379,
        ttl: 3600,
        max: 100,
        db: 0,
        password: 'redispassword',
        username: 'redisuser',
      });
    });
  });

  describe('redisPubSub', () => {
    it('should return a valid RedisPubSubConfig object', () => {
      jest.spyOn(configService, 'get').mockImplementation((key) => {
        if (key === 'RedisPubSub.PORT') return 6379;
        if (key === 'RedisPubSub.HOST') return 'localhost';
        if (key === 'RedisPubSub.PASS') return 'redispassword';
        if (key === 'RedisPubSub.USER') return 'redisuser';
        return null;
      });

      expect(service.redisPubSub).toEqual({
        transport: Transport.REDIS,
        options: {
          port: 6379,
          host: 'localhost',
          password: 'redispassword',
          username: 'redisuser',
        },
      });
    });
  });

  describe('bullMQ', () => {
    it('should return a valid BullMQConfig object', () => {
      jest.spyOn(configService, 'get').mockImplementation((key) => {
        if (key === 'BullMQ.PORT') return 6379;
        if (key === 'BullMQ.HOST') return 'localhost';
        if (key === 'BullMQ.PASS') return 'bullmqpassword';
        if (key === 'BullMQ.USER') return 'bullmquser';
        return null;
      });

      expect(service.bullMQ).toEqual({
        connection: {
          port: 6379,
          host: 'localhost',
          password: 'bullmqpassword',
          username: 'bullmquser',
        },
      });
    });
  });

  describe('mqtt', () => {
    it('should return a valid MqttClientOptions object', () => {
      jest.spyOn(configService, 'get').mockImplementation((key) => {
        if (key === 'MQTTClientConfig.BROKER_URL') return 'mqtt://localhost:1883';
        if (key === 'MQTTClientConfig.KEEPALIVE') return 60;
        if (key === 'MQTTClientConfig.CONNECTION_TIMEOUT') return 30 * 1000;
        if (key === 'MQTTClientConfig.RECONNECT_PERIOD') return 10 * 1000;
        if (key === 'MQTTClientConfig.RESUBSCRIBE') return true;
        if (key === 'MQTTClientConfig.PROTOCOL') return undefined;
        if (key === 'MQTTClientConfig.HOSTNAME') return 'localhost';
        if (key === 'MQTTClientConfig.PORT') return 1883;
        if (key === 'MQTTClientConfig.USERNAME') return 'mqttuser';
        if (key === 'MQTTClientConfig.PASSWORD') return 'mqttpassword';
        return null;
      });

      expect(service.mqtt).toEqual({
        brokerUrl: 'mqtt://localhost:1883',
        options: {
          keepalive: 60,
          connectTimeout: 30 * 1000,
          reconnectPeriod: 10 * 1000,
          resubscribe: true,
          protocol: undefined,
          hostname: 'localhost',
          port: 1883,
          username: 'mqttuser',
          password: 'mqttpassword',
        },
      });
    });
  });
});
