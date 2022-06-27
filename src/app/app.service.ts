import {
  ConsoleLogger,
  INestApplication,
  Injectable,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { API_DOCS, API_DOCS_JSON } from './app.constants';
import { ConfigFactoryService } from './configs/config-factory.service';

@Injectable()
export class AppService {
  constructor(
    private readonly logger: ConsoleLogger,
    private readonly configFactory: ConfigFactoryService,
  ) {}

  getConfig() {
    return {
      APP_CONFIG: this.configFactory.app,
      AUTH_CONFIG: this.configFactory.auth,
      MONGO_CONFIG: this.configFactory.mongo,
      REDIS_CONFIG: this.configFactory.redis,
    };
  }

  useGlobalPipes(app: INestApplication) {
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: false,
        },
      }),
    );
  }

  enableVersioning(app: INestApplication) {
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
      prefix: 'api/v',
    });
  }

  enableOpenApi(app: INestApplication) {
    const { APP_CONFIG } = this.getConfig();
    if (APP_CONFIG.startSwagger) {
      const pickOpenApiObj = this.swaggerDocument();
      const openApiObj = SwaggerModule.createDocument(app, pickOpenApiObj);
      SwaggerModule.setup(API_DOCS, app, openApiObj, {
        swaggerOptions: {
          persistAuthorization: true,
          explorer: true,
          tagsSorter: 'alpha',
        },
      });
    }
  }

  logOnServerStart() {
    const config = this.getConfig();

    if (process.env.PRINT_ENV) this.logger.log(config, 'App-Configs');

    if (config.APP_CONFIG.startSwagger) {
      const { nodeEnv, httpProtocol, host, port } = config.APP_CONFIG;
      const swaggerPath = `(${nodeEnv}) => ${httpProtocol}://${host}:${port}`;
      this.logger.log(`${swaggerPath}/${API_DOCS_JSON}`);
      this.logger.log(`${swaggerPath}/${API_DOCS}`);
    }
  }

  private swaggerDocument() {
    return new DocumentBuilder()
      .setTitle('Config-Manager')
      .setDescription('A simple and convenient way to config your apps ;)')
      .setVersion('1.0')
      .addBearerAuth({
        in: 'header',
        type: 'http',
      })
      .build();
  }
}
