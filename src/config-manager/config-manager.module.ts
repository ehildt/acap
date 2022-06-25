import RedisStore from 'cache-manager-ioredis';
import { CacheModule, ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheManagerController } from './cache-manager.controller';
import { ConfigManagerController } from './config-manager.controller';
import { mongoConfigFactory } from './configs/mongo/mongo-config-factory.dbs';
import { MongoConfigRegistry } from './configs/mongo/mongo-config-registry.dbs';
import { redisConfigFactory } from './configs/redis/redis-config-factory.dbs';
import { RedisConfigRegistry } from './configs/redis/redis-config-registry.dbs';
import {
  ConfigManager,
  ConfigManagerSchema,
} from './schemas/config-manager.schema';
import { CacheManagerService } from './services/cache-manager.service';
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
          ...redisConfigFactory(config),
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      cache: true,
      ignoreEnvFile: true,
      load: [MongoConfigRegistry, RedisConfigRegistry],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: mongoConfigFactory,
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
    CacheManagerService,
    ConfigManagerRepository,
    ConsoleLogger,
    AccessTokenStrategy,
  ],
  controllers: [ConfigManagerController, CacheManagerController],
})
export class ConfigManagerModule {
  constructor(
    private readonly logger: ConsoleLogger,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    const MONGO_CONFIG = mongoConfigFactory(this.configService);
    const REDIS_CONFIG = redisConfigFactory(this.configService);

    if (process.env.PRINT_ENV)
      this.logger.log({ MONGO_CONFIG, REDIS_CONFIG }, 'Config-Manager');
  }
}
