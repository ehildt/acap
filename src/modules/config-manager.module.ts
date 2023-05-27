import { CacheModule } from '@nestjs/cache-manager';
import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import RedisStore from 'cache-manager-ioredis';

import { AppConfigRegistry } from '@/configs/app/registry.dbs';
import { ConfigManagerRegistry } from '@/configs/config-manager/registry.dbs';
import { ConfigPublisherRegistry } from '@/configs/config-publisher/registry.dbs';
import { MongoConfigRegistry } from '@/configs/mongo/registry.dbs';
import { RedisConfigRegistry } from '@/configs/redis/registry.dbs';
import { Publisher } from '@/constants/publisher.enum';
import { ConfigManagerController } from '@/controllers/config-manager.controller';
import { ConfigManagerRepository } from '@/repositories/config-manager.repository';
import { ConfigManagerConfigs, ConfigManagerConfigsSchema } from '@/schemas/configs.schema';
import { ConfigManagerNamespaces, ConfigManagerNamespacesSchema } from '@/schemas/namespaces.schema';
import { AppService } from '@/services/app.service';
import { ConfigFactoryService } from '@/services/config-factory.service';
import { ConfigManagerService } from '@/services/config-manager.service';
import { validationSchema } from '@/validations/validation.schema';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: Publisher.TOKEN,
        imports: [ConfigModule],
        extraProviders: [ConfigFactoryService],
        inject: [ConfigFactoryService],
        useFactory: ({ publisher }: ConfigFactoryService) => publisher,
      },
    ]),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigFactoryService],
      extraProviders: [ConfigFactoryService],
      useFactory: ({ redis }: ConfigFactoryService) => ({ ...redis, store: RedisStore }),
    }),
    ConfigModule.forRoot({
      cache: true,
      ignoreEnvFile: true,
      validationSchema,
      load: [
        AppConfigRegistry,
        MongoConfigRegistry,
        RedisConfigRegistry,
        ConfigManagerRegistry,
        ConfigPublisherRegistry,
      ],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService) => new ConfigFactoryService(configService).mongo,
    }),
    MongooseModule.forFeature([
      {
        name: ConfigManagerConfigs.name,
        schema: ConfigManagerConfigsSchema,
        collection: 'configs',
      },
      {
        name: ConfigManagerNamespaces.name,
        schema: ConfigManagerNamespacesSchema,
        collection: 'namespaces',
      },
    ]),
  ],
  providers: [ConfigManagerService, ConfigManagerRepository, ConfigFactoryService, AppService, ConsoleLogger],
  controllers: [ConfigManagerController],
})
export class ConfigManagerModule {}
