import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import RedisStore from 'cache-manager-ioredis';

import { BULLMQ_METAE_QUEUE, BULLMQ_REALMS_QUEUE, BULLMQ_SCHEMAS_QUEUE, REDIS_PUBSUB } from '@/constants/app.constants';
import { FilesController } from '@/controllers/files.controller';
import { JsonSchemaController } from '@/controllers/json-schema.controller';
import { MetaController } from '@/controllers/meta.controller';
import { RealmController } from '@/controllers/realm.controller';
import { RealmRepository } from '@/repositories/realm.repository';
import { SchemaRepository } from '@/repositories/schema.repository';
import { JsonSchemaConfigsDefinition, JsonSchemaConfigsSchema } from '@/schemas/json-schema-config-definition.schema';
import { JsonSchema, JsonSchemaDefinition } from '@/schemas/json-schema-definition.schema';
import { RealmConfigsSchema, RealmConfigsSchemaDefinition } from '@/schemas/realm-configs-definition.schema';
import { RealmsSchema, RealmsSchemaDefinition } from '@/schemas/realms-schema-definition.schema';
import { AppService } from '@/services/app.service';
import { ConfigFactoryService } from '@/services/config-factory.service';
import { MetaService } from '@/services/meta.service';
import { RealmService } from '@/services/realm.service';
import { SchemaService } from '@/services/schema.service';

import { GlobalAvJModule } from './global-ajv.module';
import { GlobalConfigFactoryModule } from './global-config-factory.module';
import { GlobalRedisPubSubModule } from './global-redis-pubsub.module';

@Module({
  imports: [
    ClientsModule.registerAsync(
      [
        process.env.USE_REDIS_PUBSUB && {
          name: REDIS_PUBSUB,
          imports: [ConfigModule],
          inject: [ConfigFactoryService],
          useFactory: async ({ redisPubSub }: ConfigFactoryService) => redisPubSub,
        },
      ].filter((item) => item),
    ),
    process.env.USE_BULLMQ &&
      BullModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigFactoryService],
        useFactory: async ({ bullMQ }: ConfigFactoryService) => bullMQ,
      }),
    process.env.USE_BULLMQ &&
      BullModule.registerQueue(
        {
          name: BULLMQ_REALMS_QUEUE,
        },
        {
          name: BULLMQ_SCHEMAS_QUEUE,
        },
        {
          name: BULLMQ_METAE_QUEUE,
        },
      ),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService) => new ConfigFactoryService(configService).mongo,
    }),
    MongooseModule.forFeature([
      {
        name: RealmsSchemaDefinition.name,
        schema: RealmsSchema,
        collection: 'REALM',
      },
      {
        name: RealmConfigsSchemaDefinition.name,
        schema: RealmConfigsSchema,
        collection: 'REALM_CONFIG',
      },
      {
        name: JsonSchemaDefinition.name,
        schema: JsonSchema,
        collection: 'SCHEMA',
      },
      {
        name: JsonSchemaConfigsDefinition.name,
        schema: JsonSchemaConfigsSchema,
        collection: 'SCHEMA_CONFIG',
      },
    ]),
    GlobalAvJModule,
    GlobalConfigFactoryModule,
    GlobalRedisPubSubModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigFactoryService],
      extraProviders: [ConfigFactoryService],
      useFactory: ({ redis }: ConfigFactoryService) => ({ ...redis, store: RedisStore }),
    }),
  ].filter((item) => item),
  providers: [AppService, ConsoleLogger, RealmService, RealmRepository, SchemaService, SchemaRepository, MetaService],
  controllers: [RealmController, FilesController, JsonSchemaController, MetaController],
})
export class AppModule {}
