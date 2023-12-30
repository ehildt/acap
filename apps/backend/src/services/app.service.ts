import { ConsoleLogger, Injectable, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import { join } from 'path';

import { API_DOCS, API_DOCS_JSON } from '../constants/app.constants';
import { ConfigFactoryService } from './config-factory.service';

const packageJson = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf8'));

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
    SwaggerModule.setup(
      API_DOCS,
      app,
      SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
          .setTitle(packageJson.name.toUpperCase())
          .setDescription(packageJson.description)
          .setVersion(packageJson.version)
          .build(),
      ),
    );
  }

  logOnServerStart() {
    if (this.configFactory.app.printEnv) {
      this.logger.log(
        {
          ...this.configFactory.app,
          brokers: {
            useBullMQ: this.configFactory.app.brokers.useBullMQ ? this.configFactory.bullMQ : false,
            useRedisPubSub: this.configFactory.app.brokers.useRedisPubSub ? this.configFactory.redisPubSub : false,
            useMqtt: this.configFactory.app.brokers.useMQTT ? this.configFactory.mqtt : false,
          },
          databases: {
            mongo: this.configFactory.mongo,
            redis: this.configFactory.redis,
          },
        },
        'ACAP_CONFIGURATION',
      );
    }

    if (this.configFactory.app.startSwagger) {
      const swaggerPath = `http://localhost:${this.configFactory.app.port}`;
      this.logger.log(`${swaggerPath}/${API_DOCS_JSON}`);
      this.logger.log(`${swaggerPath}/${API_DOCS}`);
    }
  }
}
