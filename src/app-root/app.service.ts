import { ConsoleLogger, Injectable, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigFactoryService } from './configs/config-factory.service';
import { API_DOCS, API_DOCS_JSON } from './constants/app.constants';

@Injectable()
export class AppService {
  constructor(private readonly logger: ConsoleLogger, private readonly configFactory: ConfigFactoryService) {}

  useGlobalPipes(app: NestFastifyApplication) {
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

  enableVersioning(app: NestFastifyApplication) {
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
      prefix: 'api/v',
    });
  }

  enableOpenApi(app: NestFastifyApplication) {
    const { startSwagger } = this.configFactory.app;
    if (startSwagger) {
      const openApiObj = SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
          .setTitle('Config-Manager')
          .setDescription('A simple and convenient way to config your apps ;)')
          .setVersion('1.0')
          .build(),
      );
      SwaggerModule.setup(API_DOCS, app, openApiObj, {
        swaggerOptions: {
          explorer: true,
          tagsSorter: 'alpha',
        },
      });
    }
  }

  logOnServerStart(appFactory: any, configFactory: any) {
    if (process.env.PRINT_ENV === 'true')
      this.logger.log(
        JSON.stringify(
          {
            APP_CONFIG: appFactory.app,
            CONFIG_MANAGER_CONFIG: configFactory.config,
            MONGO_CONFIG: configFactory.mongo,
            REDIS_CONFIG: configFactory.redis,
          },
          null,
          4,
        ),
        'AppConfiguration',
      );

    if (appFactory.app.startSwagger) {
      const swaggerPath = `http://localhost:${appFactory.app.port}`;
      this.logger.log(`${swaggerPath}/${API_DOCS_JSON}`);
      this.logger.log(`${swaggerPath}/${API_DOCS}`);
    }
  }
}
