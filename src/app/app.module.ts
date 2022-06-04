import { ConfigManagerModule } from '@/config-manager/config-manager.module';
import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig, appConfigFactory } from './app.config.dbs';
import { API_DOCS, API_DOCS_JSON, SWAGGER } from './app.constants';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigManagerModule,
    ConfigModule.forRoot({
      load: [AppConfig],
      cache: process.env.CONFIG_MODULE_CACHE == 'true',
      ignoreEnvFile: true,
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
    this.logger.log({ APP_CONFIG }, 'App');

    if (APP_CONFIG.swaggerAutoStart) {
      const { nodeEnv, httpProtocol, host, port } = APP_CONFIG;
      const swaggerPath = `(${nodeEnv}) => ${httpProtocol}://${host}:${port}`;
      this.logger.log(`${swaggerPath}/${API_DOCS_JSON}`, SWAGGER);
      this.logger.log(`${swaggerPath}/${API_DOCS}`, SWAGGER);
    }
  }
}
