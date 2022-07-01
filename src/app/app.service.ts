import {
  ConsoleLogger,
  INestApplication,
  Injectable,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigFactoryService } from './configs/config-factory.service';
import { API_DOCS, API_DOCS_JSON } from './constants/app.constants';

@Injectable()
export class AppService {
  constructor(
    private readonly logger: ConsoleLogger,
    private readonly configFactory: ConfigFactoryService,
  ) {}

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
    const { startSwagger } = this.configFactory.app;
    if (startSwagger) {
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

  logOnServerStart(
    appFactory: any,
    authFactory: any,
    cacheFactory: any,
    configFactory: any,
  ) {
    if (process.env.PRINT_ENV)
      this.logger.log(
        JSON.stringify(
          {
            APP_CONFIG: appFactory.app,
            AUTH_MANAGER_CONFIG: authFactory.auth,
            CACHE_MANAGER_CONFIG: cacheFactory.cache,
            CONFIG_MANAGER_CONFIG: configFactory.config,
            MONGO_CONFIG: authFactory.mongo,
            REDIS_CONFIG: authFactory.redis,
          },
          null,
          4,
        ),
        'AppConfiguration',
      );

    if (appFactory.app.startSwagger) {
      const swaggerPath = `https://localhost:${appFactory.app.port}`;
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
