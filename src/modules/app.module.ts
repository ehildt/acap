import { CacheModule } from '@nestjs/cache-manager';
import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import RedisStore from 'cache-manager-ioredis';

import { AppService } from '@/services/app.service';
import { ConfigFactoryService } from '@/services/config-factory.service';

import { ClientsGlobalModule } from './clients.module';
import { ConfigFactoryGlobalModule } from './config-factory.module';
import { PubSubGlobalModule } from './pubsub.module';
import { CachedRealmsModule } from './realms.module';

@Module({
  imports: [
    ClientsGlobalModule,
    ConfigFactoryGlobalModule,
    PubSubGlobalModule,
    CachedRealmsModule,
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
