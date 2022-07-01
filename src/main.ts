import { NestFactory } from '@nestjs/core';
import { AppModule } from './app-root/app.module';
import { AppService } from './app-root/app.service';
import { ConfigFactoryService as AppFactory } from './app-root/configs/config-factory.service';
import { ConfigFactoryService as ConfigFactory } from './config-manager/configs/config-factory.service';

void (async () => {
  const app = await NestFactory.create(AppModule);
  const appService = app.get(AppService);
  const appFactory = app.get(AppFactory);
  const configFactory = app.get(ConfigFactory);

  appService.useGlobalPipes(app);
  appService.enableVersioning(app);
  appService.enableOpenApi(app);

  await app.listen(appFactory.app.port, () => appService.logOnServerStart(appFactory, configFactory));
})();
