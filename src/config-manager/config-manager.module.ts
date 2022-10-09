import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import RedisStore from 'cache-manager-ioredis';

import { ConfigManagerController } from './config-manager.controller';
import { ConfigFactoryService } from './configs/config-factory.service';
import { ConfigManagerRegistry } from './configs/config-manager/registry.dbs';
import { ConfigPublisherRegistry } from './configs/config-publisher/registry.dbs';
import { MongoConfigRegistry } from './configs/mongo/registry.dbs';
import { RedisConfigRegistry } from './configs/redis/registry.dbs';
import { Publisher } from './constants/publisher.enum';
import { ConfigManagerConfigs, ConfigManagerConfigsSchema } from './schemas/configs.schema';
import { ConfigManagerNamespaces, ConfigManagerNamespacesSchema } from './schemas/namespaces.schema';
import { ConfigManagerRepository } from './services/config-manager.repository';
import { ConfigManagerService } from './services/config-manager.service';
import { envValidationSchema } from './validations/env.validation.schema';

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
      load: [MongoConfigRegistry, RedisConfigRegistry, ConfigManagerRegistry, ConfigPublisherRegistry],
      validationSchema: envValidationSchema,
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
  providers: [ConfigManagerService, ConfigManagerRepository, ConfigFactoryService],
  controllers: [ConfigManagerController],
})
export class ConfigManagerModule {}
