import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { CachedRealmsController } from '@/controllers/cached-realms.controller';
import { FilesController } from '@/controllers/files.controller';
import { JsonSchemaController } from '@/controllers/json-schema.controller';
import { PersistedRealmsController } from '@/controllers/persisted-realms.controller';
import { RealmsRepository } from '@/repositories/realms.repository';
import { SchemaRepository } from '@/repositories/schema.repository';
import { JsonSchemaConfigsDefinition, JsonSchemaConfigsSchema } from '@/schemas/json-schema-config-definition.schema';
import { JsonSchema, JsonSchemaDefinition } from '@/schemas/json-schema-definition.schema';
import { RealmConfigsSchema, RealmConfigsSchemaDefinition } from '@/schemas/realm-configs-definition.schema';
import { RealmsSchema, RealmsSchemaDefinition } from '@/schemas/realms-schema-definition.schema';
import { ConfigFactoryService } from '@/services/config-factory.service';
import { RealmsService } from '@/services/realms.service';
import { SchemaService } from '@/services/schema.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService) => new ConfigFactoryService(configService).mongo,
    }),
    MongooseModule.forFeature([
      {
        name: RealmsSchemaDefinition.name,
        schema: RealmsSchema,
        collection: 'realms',
      },
      {
        name: RealmConfigsSchemaDefinition.name,
        schema: RealmConfigsSchema,
        collection: 'realmConfigs',
      },
      {
        name: JsonSchemaDefinition.name,
        schema: JsonSchema,
        collection: 'schemas',
      },
      {
        name: JsonSchemaConfigsDefinition.name,
        schema: JsonSchemaConfigsSchema,
        collection: 'schemaConfigs',
      },
    ]),
  ],
  providers: [RealmsService, RealmsRepository, SchemaService, SchemaRepository],
  controllers: [CachedRealmsController, PersistedRealmsController, FilesController, JsonSchemaController],
})
export class RealmsModule {}
