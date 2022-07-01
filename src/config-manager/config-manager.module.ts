import RedisStore from 'cache-manager-ioredis';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigManagerController } from './config-manager.controller';
import { ConfigFactoryService } from './configs/config-factory.service';
import { ConfigManagerRegistry } from './configs/config-manager/registry.dbs';
import { MongoConfigRegistry } from './configs/mongo/registry.dbs';
import { RedisConfigRegistry } from './configs/redis/registry.dbs';
import {
  ConfigManager,
  ConfigManagerSchema,
} from './schemas/config-manager.schema';
import { ConfigManagerRepository } from './services/config-manager.repository';
import { ConfigManagerService } from './services/config-manager.service';
import { AccessTokenStrategy } from './strategies/access-token.strategy';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          store: RedisStore,
          ...new ConfigFactoryService(config).redis,
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      cache: true,
      ignoreEnvFile: true,
      load: [MongoConfigRegistry, RedisConfigRegistry, ConfigManagerRegistry],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (service) => new ConfigFactoryService(service).mongo,
    }),
    MongooseModule.forFeature([
      {
        name: ConfigManager.name,
        schema: ConfigManagerSchema,
        collection: 'configs',
      },
    ]),
  ],
  providers: [
    ConfigManagerService,
    ConfigManagerRepository,
    AccessTokenStrategy,
    ConfigFactoryService,
  ],
  controllers: [ConfigManagerController],
})
export class ConfigManagerModule {}
