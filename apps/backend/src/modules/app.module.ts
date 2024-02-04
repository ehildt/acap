import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import RedisStore from 'cache-manager-ioredis';

import { BULLMQ_REALM_QUEUE, REDIS_PUBSUB } from '@/constants/app.constants';
import { JsonSchemaController } from '@/controllers/json-schema.controller';
import { MetaController } from '@/controllers/meta.controller';
import { OutbreakController } from '@/controllers/outbreak.controller';
import { RealmController } from '@/controllers/realm.controller';
import { RealmRepository } from '@/repositories/realm.repository';
import { SchemaRepository } from '@/repositories/schema.repository';
import { JsonSchemaContentSchema, JsonSchemaContentsDefinition } from '@/schemas/json-schema-content-definition.schema';
import { JsonSchema, JsonSchemaDefinition } from '@/schemas/json-schema-definition.schema';
import { RealmContentsSchema, RealmContentsSchemaDefinition } from '@/schemas/realm-content-definition.schema';
import { RealmsSchema, RealmsSchemaDefinition } from '@/schemas/realms-schema-definition.schema';
import { AppService } from '@/services/app.service';
import { ConfigFactoryService } from '@/services/config-factory.service';
import { CryptoService } from '@/services/crypto.service';
import { MetaService } from '@/services/meta.service';
import { OutbreakService } from '@/services/outbreak.service';
import { RealmService } from '@/services/realm.service';
import { SchemaService } from '@/services/schema.service';

import { GlobalAvJModule } from './global-ajv.module';
import { GlobalConfigFactoryModule } from './global-config-factory.module';
import { MqttClientModule } from './mqtt-client.module';

const useRedisPubSub = process.env.USE_REDIS_PUBSUB === 'true';
const useBullMQ = process.env.USE_BULLMQ === 'true';
const useMQTTClient = process.env.USE_MQTT === 'true';

@Module({
  imports: [
    useRedisPubSub &&
      ClientsModule.registerAsync([
        {
          name: REDIS_PUBSUB,
          imports: [ConfigModule],
          inject: [ConfigFactoryService],
          useFactory: async ({ redisPubSub }: ConfigFactoryService) => redisPubSub,
        },
      ]),
    useBullMQ &&
      BullModule.registerQueueAsync({
        imports: [ConfigModule],
        inject: [ConfigFactoryService],
        useFactory: async ({ bullMQ }: ConfigFactoryService) => ({ ...bullMQ, name: BULLMQ_REALM_QUEUE }),
      }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigFactoryService],
      useFactory: ({ mongo }: ConfigFactoryService) => mongo,
    }),
    MongooseModule.forFeature([
      {
        name: RealmsSchemaDefinition.name,
        schema: RealmsSchema,
        collection: 'REALM',
      },
      {
        name: RealmContentsSchemaDefinition.name,
        schema: RealmContentsSchema,
        collection: 'REALM_CONTENT',
      },
      {
        name: JsonSchemaDefinition.name,
        schema: JsonSchema,
        collection: 'SCHEMA',
      },
      {
        name: JsonSchemaContentsDefinition.name,
        schema: JsonSchemaContentSchema,
        collection: 'SCHEMA_CONTENT',
      },
    ]),
    GlobalAvJModule,
    GlobalConfigFactoryModule,
    useMQTTClient &&
      MqttClientModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigFactoryService],
        isGlobal: true,
        useFactory: ({ mqtt }: ConfigFactoryService) => ({ ...mqtt }),
      }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigFactoryService],
      extraProviders: [ConfigFactoryService],
      useFactory: ({ redis }: ConfigFactoryService) => ({ ...redis, store: RedisStore }),
    }),
  ].filter((exists) => exists),
  providers: [
    AppService,
    ConsoleLogger,
    RealmService,
    RealmRepository,
    SchemaService,
    SchemaRepository,
    MetaService,
    OutbreakService,
    CryptoService,
  ],
  controllers: [RealmController, JsonSchemaController, MetaController, OutbreakController],
})
export class AppModule {}
