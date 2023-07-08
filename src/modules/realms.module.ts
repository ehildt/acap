import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { FilesController } from '@/controllers/files.controller';
import { JsonSchemaController } from '@/controllers/json-schema.controller';
import { RealmController } from '@/controllers/realm.controller';
import { RealmRepository } from '@/repositories/realm.repository';
import { SchemaRepository } from '@/repositories/schema.repository';
import { JsonSchemaConfigsDefinition, JsonSchemaConfigsSchema } from '@/schemas/json-schema-config-definition.schema';
import { JsonSchema, JsonSchemaDefinition } from '@/schemas/json-schema-definition.schema';
import { RealmConfigsSchema, RealmConfigsSchemaDefinition } from '@/schemas/realm-configs-definition.schema';
import { RealmsSchema, RealmsSchemaDefinition } from '@/schemas/realms-schema-definition.schema';
import { ConfigFactoryService } from '@/services/config-factory.service';
import { RealmService } from '@/services/realm.service';
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
  ],
  providers: [RealmService, RealmRepository, SchemaService, SchemaRepository],
  controllers: [RealmController, FilesController, JsonSchemaController],
})
export class RealmsModule {}
