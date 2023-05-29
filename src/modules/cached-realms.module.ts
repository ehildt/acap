import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { CachedRealmsController } from '@/controllers/cached-realms.controller';
import { ConfigManagerRepository } from '@/repositories/config-manager.repository';
import { ConfigManagerConfigs, ConfigManagerConfigsSchema } from '@/schemas/configs.schema';
import { ConfigManagerRealms, ConfigManagerRealmsSchema } from '@/schemas/realms.schema';
import { ConfigFactoryService } from '@/services/config-factory.service';
import { ManagerService } from '@/services/manager.service';

@Module({
  imports: [
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
        name: ConfigManagerRealms.name,
        schema: ConfigManagerRealmsSchema,
        collection: 'realms',
      },
    ]),
  ],
  providers: [ManagerService, ConfigManagerRepository],
  controllers: [CachedRealmsController],
})
export class CachedRealmsModule {}
