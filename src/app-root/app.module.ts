import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ConfigManagerModule } from '@/config-manager.module';

import { AppService } from './app.service';
import { AppConfigRegistry } from './configs/app-config/app-config-registry.dbs';
import { ConfigFactoryService } from './configs/config-factory.service';
import { envValidationSchema } from './validations/env.validation.schema';

@Module({
  imports: [
    ConfigManagerModule,
    ConfigModule.forRoot({
      cache: true,
      ignoreEnvFile: true,
      load: [AppConfigRegistry],
      validationSchema: envValidationSchema,
    }),
  ],
  providers: [AppService, ConsoleLogger, ConfigFactoryService],
})
export class AppModule {}
