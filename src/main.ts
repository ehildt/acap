import fastifyMultipart from '@fastify/multipart';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { ConfigFactoryService } from './configs/config-factory.service';
import { AppModule } from './modules/app.module';
import { AppService } from './services/app.service';

void (async () => {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const appService = app.get(AppService);
  const factory = app.get(ConfigFactoryService);

  appService.useGlobalPipes(app);
  appService.enableVersioning(app);
  appService.enableOpenApi(app);

  await app.register(fastifyMultipart);
  await app.listen(factory.app.port, '0.0.0.0');
  appService.logOnServerStart(factory);
})();
