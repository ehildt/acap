import compression from 'compression';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AppService } from './app/app.service';
import { appConfigFactory } from './app/configs/app-config-registry.dbs';

(async () => {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(compression());
  app.getHttpAdapter().getInstance().set('etag', false);

  app.get(AppService).useGlobalPipes(app);
  app.get(AppService).enableVersioning(app);
  app.get(AppService).enableOpenApi(app);

  await app.listen(appConfigFactory(app.get(ConfigService)).port);
})();
