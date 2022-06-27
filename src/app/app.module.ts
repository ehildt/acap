import { AuthManagerModule } from '@/auth-manager/auth-manager.module';
import { ConfigManagerModule } from '@/config-manager/config-manager.module';
import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AppConfigRegistry } from './configs/app-config-registry.dbs';

@Module({
  imports: [
    AuthManagerModule,
    ConfigManagerModule,
    ConfigModule.forRoot({
      cache: true,
      ignoreEnvFile: true,
      load: [AppConfigRegistry],
    }),
  ],
  providers: [AppService, ConsoleLogger],
})
export class AppModule {}
