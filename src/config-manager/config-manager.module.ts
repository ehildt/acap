import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigManagerController } from './config-manager.controller';
import { ConfigFactoryService } from './configs/config-factory.service';
import { ConfigManagerRegistry } from './configs/config-manager/registry.dbs';
import { ConfigPublisherRegistry } from './configs/config-publisher/registry.dbs';
import { MongoConfigRegistry } from './configs/mongo/registry.dbs';
import { RedisConfigRegistry } from './configs/redis/registry.dbs';
import { Publisher } from './constants/publisher.enum';
import { ConfigManager, ConfigManagerSchema } from './schemas/config-manager.schema';
import { ConfigManagerRepository } from './services/config-manager.repository';
import { ConfigManagerService } from './services/config-manager.service';

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
      useFactory: ({ redis }: ConfigFactoryService) => redis,
    }),
    ConfigModule.forRoot({
      cache: true,
      ignoreEnvFile: true,
      load: [MongoConfigRegistry, RedisConfigRegistry, ConfigManagerRegistry, ConfigPublisherRegistry],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService) => new ConfigFactoryService(configService).mongo,
    }),
    MongooseModule.forFeature([
      {
        name: ConfigManager.name,
        schema: ConfigManagerSchema,
        collection: 'configs',
      },
    ]),
  ],
  providers: [ConfigManagerService, ConfigManagerRepository, ConfigFactoryService],
  controllers: [ConfigManagerController],
})
export class ConfigManagerModule {}
