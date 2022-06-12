import { ConfigManagerModule } from '@/config-manager/config-manager.module';
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

    if (process.env.PRINT_ENV) this.logger.log({ APP_CONFIG }, 'App');

    if (APP_CONFIG.startSwagger) {
      const { nodeEnv, httpProtocol, host, port } = APP_CONFIG;
      const swaggerPath = `(${nodeEnv}) => ${httpProtocol}://${host}:${port}`;
      this.logger.log(`${swaggerPath}/${API_DOCS_JSON}`, SWAGGER);
      this.logger.log(`${swaggerPath}/${API_DOCS}`, SWAGGER);
    }
  }
}
