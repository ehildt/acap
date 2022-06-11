import RedisStore from 'cache-manager-ioredis';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigManagerController } from './config-manager.controller';
import { mongoConfigFactory } from './configs/mongo/mongo-config-factory.dbs';
import { MongoConfigRegistry } from './configs/mongo/mongo-config-registry.dbs';
import { redisCacheConfigFactory } from './configs/redis-cache/redis-cache-config-factory.dbs';
import { RedisCacheConfigRegistry } from './configs/redis-cache/redis-cache-config-registry.dbs';
import {
  ConfigManager,
  ConfigManagerSchema,
} from './schemas/config-manager.schema';
import { ConfigManagerRepository } from './services/config-manager.repository';
import { ConfigManagerService } from './services/config-manager.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          store: RedisStore,
          ...redisCacheConfigFactory(config),
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      cache: true,
      ignoreEnvFile: true,
      load: [MongoConfigRegistry, RedisCacheConfigRegistry],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: mongoConfigFactory,
    }),
    MongooseModule.forFeature([
      { name: ConfigManager.name, schema: ConfigManagerSchema },
    ]),
  ],
  providers: [ConfigManagerService, ConfigManagerRepository],
  controllers: [ConfigManagerController],
})
export class ConfigManagerModule {}
