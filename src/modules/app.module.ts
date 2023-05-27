import { Module } from '@nestjs/common';

import { ConfigManagerModule } from './config-manager.module';

@Module({
  imports: [ConfigManagerModule],
})
export class AppModule {}
