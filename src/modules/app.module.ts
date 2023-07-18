import { CacheModule } from '@nestjs/cache-manager';
import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import RedisStore from 'cache-manager-ioredis';

import { AppService } from '@/services/app.service';
import { ConfigFactoryService } from '@/services/config-factory.service';

import { GlobalAvJModule } from './global-ajv.module';
import { GlobalClientsModule } from './global-clients.module';
import { GlobalConfigFactoryModule } from './global-config-factory.module';
import { GlobalRedisPubSubModule } from './global-redis-pubsub.module';
import { RealmSchemaModule } from './realm-schema.module';

@Module({
  imports: [
    GlobalAvJModule,
    GlobalClientsModule,
    GlobalConfigFactoryModule,
    GlobalRedisPubSubModule,
    RealmSchemaModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigFactoryService],
      extraProviders: [ConfigFactoryService],
      useFactory: ({ redis }: ConfigFactoryService) => ({ ...redis, store: RedisStore }),
    }),
  ],
  providers: [AppService, ConsoleLogger],
})
export class AppModule {}
