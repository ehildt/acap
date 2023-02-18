import fastifyMultipart from '@fastify/multipart';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app-root/app.module';
import { AppService } from './app-root/app.service';
import { ConfigFactoryService as AppFactory } from './app-root/configs/config-factory.service';
import { ConfigFactoryService as ConfigFactory } from './config-manager/configs/config-factory.service';

void (async () => {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const appService = app.get(AppService);
  const appFactory = app.get(AppFactory);
  const configFactory = app.get(ConfigFactory);

  appService.useGlobalPipes(app);
  appService.enableVersioning(app);
  appService.enableOpenApi(app);

  await app.register(fastifyMultipart);
  await app.listen(process.env.PORT || 3001);
  appService.logOnServerStart(appFactory, configFactory);
})();
