import compression from 'compression';
import fs from 'fs';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AppService } from './app/app.service';
import { ConfigFactoryService as AppFactory } from './app/configs/config-factory.service';
import { ConfigFactoryService as AuthFactory } from './auth-manager/configs/config-factory.service';

const httpsOptions = {
  key: fs.readFileSync('./ssl/127.0.0.1.key'),
  cert: fs.readFileSync('./ssl/127.0.0.1.crt'),
};

(async () => {
  const app = await NestFactory.create(AppModule, { httpsOptions });
  const appService = app.get(AppService);
  const appFactory = app.get(AppFactory);
  const authFactory = app.get(AuthFactory);

  app.use(helmet());
  app.use(compression());
  app.getHttpAdapter().getInstance().set('etag', false);

  appService.useGlobalPipes(app);
  appService.enableVersioning(app);
  appService.enableOpenApi(app);

  await app.listen(appFactory.app.port, () =>
    appService.logOnServerStart(appFactory, authFactory),
  );
})();
