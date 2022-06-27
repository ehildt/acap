import compression from 'compression';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AppService } from './app/app.service';

(async () => {
  const app = await NestFactory.create(AppModule);
  const appService = app.get(AppService);
  const config = appService.getConfig();

  app.use(helmet());
  app.use(compression());
  app.getHttpAdapter().getInstance().set('etag', false);

  appService.useGlobalPipes(app);
  appService.enableVersioning(app);
  appService.enableOpenApi(app);

  await app.listen(config.APP_CONFIG.port, () => appService.logOnServerStart());
})();
