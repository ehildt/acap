import fastifyMultipart from '@fastify/multipart';
import { LogLevel } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './modules/app.module';
import { AppService } from './services/app.service';
import { ConfigFactoryService } from './services/config-factory.service';

const LOG_LEVEL: Array<LogLevel> =
  process.env.NODE_ENV === 'production' ? ['warn', 'error'] : ['warn', 'error', 'debug', 'log', 'verbose'];

void (async () => {
  const adapter = new FastifyAdapter();
  adapter.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, { logger: LOG_LEVEL });
  const appService = app.get(AppService);
  const factory = app.get(ConfigFactoryService);

  appService.useGlobalPipes(app);
  appService.enableVersioning(app);
  appService.enableOpenApi(app);
  appService.addYamlContentType(app);

  process.on('SIGINT', process.exit);
  process.on('SIGTERM', process.exit);
  process.on('SIGQUIT', process.exit);

  await app.register(fastifyMultipart);
  await app.listen(factory.app.port, factory.app.address);
  appService.logOnServerStart(factory);
})();
