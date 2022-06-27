import compression from 'compression';
import fs from 'fs';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AppService } from './app/app.service';

const httpsOptions = {
  key: fs.readFileSync('./ssl/127.0.0.1.key'),
  cert: fs.readFileSync('./ssl/127.0.0.1.crt'),
};

(async () => {
  const app = await NestFactory.create(AppModule, { httpsOptions });
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
