import { ConfigManagerModule } from '@/config-manager/config-manager.module';
import { mongoConfigFactory } from '@/config-manager/configs/mongo/mongo-config-factory.dbs';
import { redisCacheConfigFactory } from '@/config-manager/configs/redis-cache/redis-cache-config-factory.dbs';
import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { API_DOCS, API_DOCS_JSON, SWAGGER } from './app.constants';
import { AppService } from './app.service';
import { appConfigFactory } from './configs/app-config-factory.dbs';
import { AppConfigRegistry } from './configs/app-config-registry.dbs';

@Module({
  imports: [
    ConfigManagerModule,
    ConfigModule.forRoot({
      cache: true,
      ignoreEnvFile: true,
      load: [AppConfigRegistry],
    }),
  ],
  providers: [AppService, ConsoleLogger],
})
export class AppModule {
  constructor(
    private readonly logger: ConsoleLogger,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    const APP_CONFIG = appConfigFactory(this.configService);
    const MONGO_CONFIG = mongoConfigFactory(this.configService);
    const REDIS_CACHE_CONFIG = redisCacheConfigFactory(this.configService);

    if (APP_CONFIG.printEnv)
      this.logger.log(
        { APP_CONFIG, MONGO_CONFIG, REDIS_CACHE_CONFIG },
        'Config-Manager',
      );

    if (APP_CONFIG.startSwagger) {
      const { nodeEnv, httpProtocol, host, port } = APP_CONFIG;
      const swaggerPath = `(${nodeEnv}) => ${httpProtocol}://${host}:${port}`;
      this.logger.log(`${swaggerPath}/${API_DOCS_JSON}`, SWAGGER);
      this.logger.log(`${swaggerPath}/${API_DOCS}`, SWAGGER);
    }
  }
}
