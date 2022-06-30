import RedisStore from 'cache-manager-ioredis';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheManagerController } from '../cache-manager/cache-manager.controller';
import { ConfigFactoryService } from './configs/config-factory.service';
import { RedisConfigRegistry } from './configs/redis/redis-config-registry.dbs';
import { CacheManagerService } from './services/cache-manager.service';
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
      load: [RedisConfigRegistry],
    }),
  ],
  providers: [CacheManagerService, AccessTokenStrategy, ConfigFactoryService],
  controllers: [CacheManagerController],
})
export class CacheManagerModule {}
