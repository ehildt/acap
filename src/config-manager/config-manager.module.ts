import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigManagerController } from './config-manager.controller';
import { mongoConfigFactory } from './configs/mongo/mongo-config-factory.dbs';
import { MongoConfigRegistry } from './configs/mongo/mongo-config-registry.dbs';
import {
  ConfigManager,
  ConfigManagerSchema,
} from './schemas/config-manager.schema';
import { ConfigManagerRepository } from './services/config-manager.repository';
import { ConfigManagerService } from './services/config-manager.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      ignoreEnvFile: true,
      load: [MongoConfigRegistry],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: mongoConfigFactory,
    }),
    MongooseModule.forFeature([
      { name: ConfigManager.name, schema: ConfigManagerSchema },
    ]),
  ],
  providers: [ConfigManagerService, ConfigManagerRepository, ConsoleLogger],
  controllers: [ConfigManagerController],
})
export class ConfigManagerModule {
  constructor(
    private readonly logger: ConsoleLogger,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    const MONGO_CONFIG = mongoConfigFactory(this.configService);
    this.logger.log({ MONGO_CONFIG }, 'Config-Manager');
  }
}
