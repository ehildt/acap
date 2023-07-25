import { ConsoleLogger, Injectable, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { API_DOCS, API_DOCS_JSON } from '../constants/app.constants';
import { ConfigFactoryService } from './config-factory.service';

@Injectable()
export class AppService {
  constructor(
    private readonly logger: ConsoleLogger,
    private readonly configFactory: ConfigFactoryService,
  ) {}

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
    if (!this.configFactory.app.startSwagger) return;
    const openApiObj = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('ACAP')
        .setDescription('A simple and convenient way to dynamically distribute and provide content to your services ;)')
        .setVersion('0.9.1')
        .build(),
    );
    SwaggerModule.setup(API_DOCS, app, openApiObj);
  }

  addYamlContentType(app: NestFastifyApplication) {
    app
      .getHttpAdapter()
      .getInstance()
      .addContentTypeParser('application/x-yaml', { parseAs: 'string' }, (_, body, done) => done(null, body));
  }

  logOnServerStart(appFactory: ConfigFactoryService) {
    if (process.env.PRINT_ENV === 'true')
      this.logger.log(
        {
          APP: appFactory.app,
          MONGO: appFactory.mongo,
          REDIS: appFactory.redis,
          REDIS_PUBSUB: appFactory.app.services.useRedisPubSub ? appFactory.redisPubSub : undefined,
          BULLMQ: appFactory.app.services.useBullMQ ? appFactory.bullMQ : undefined,
          MQTT: appFactory.app.services.useMQTT ? appFactory.mqtt : undefined,
        },
        'ENVIRONMENT',
      );

    if (appFactory.app.startSwagger) {
      const swaggerPath = `http://localhost:${appFactory.app.port}`;
      this.logger.log(`${swaggerPath}/${API_DOCS_JSON}`);
      this.logger.log(`${swaggerPath}/${API_DOCS}`);
    }
  }
}
