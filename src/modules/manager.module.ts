import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigManagerController } from '@/controllers/manager.controller';
import { ConfigManagerRepository } from '@/repositories/config-manager.repository';
import { ConfigManagerConfigs, ConfigManagerConfigsSchema } from '@/schemas/configs.schema';
import { ConfigManagerNamespaces, ConfigManagerNamespacesSchema } from '@/schemas/namespaces.schema';
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
        name: ConfigManagerNamespaces.name,
        schema: ConfigManagerNamespacesSchema,
        collection: 'namespaces',
      },
    ]),
  ],
  providers: [ManagerService, ConfigManagerRepository],
  controllers: [ConfigManagerController],
})
export class ManagerModule {}
