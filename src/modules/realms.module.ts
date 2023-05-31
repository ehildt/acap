import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { CachedRealmsController } from '@/controllers/cached-realms.controller';
import { FilesController } from '@/controllers/files.controller';
import { PersistedRealmsController } from '@/controllers/persisted-realms.controller';
import { RealmsRepository } from '@/repositories/realms.repository';
import { RealmConfigs, RealmConfigsSchema } from '@/schemas/configs.schema';
import { Realms, RealmsSchema } from '@/schemas/realms.schema';
import { ConfigFactoryService } from '@/services/config-factory.service';
import { RealmsService } from '@/services/realms.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService) => new ConfigFactoryService(configService).mongo,
    }),
    MongooseModule.forFeature([
      {
        name: RealmConfigs.name,
        schema: RealmConfigsSchema,
        collection: 'configs',
      },
      {
        name: Realms.name,
        schema: RealmsSchema,
        collection: 'realms',
      },
    ]),
  ],
  providers: [RealmsService, RealmsRepository],
  controllers: [CachedRealmsController, PersistedRealmsController, FilesController],
})
export class RealmsModule {}
