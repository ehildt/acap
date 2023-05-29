import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppConfigRegistry } from '@/configs/app/registry.dbs';
import { MongoConfigRegistry } from '@/configs/mongo/registry.dbs';
import { PublisherRegistry } from '@/configs/publisher/registry.dbs';
import { RealmRegistry } from '@/configs/realms/registry.dbs';
import { RedisConfigRegistry } from '@/configs/redis/registry.dbs';
import { ConfigFactoryService } from '@/services/config-factory.service';
import { validationSchema } from '@/validations/validation.schema';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      ignoreEnvFile: true,
      validationSchema,
      load: [AppConfigRegistry, MongoConfigRegistry, RedisConfigRegistry, RealmRegistry, PublisherRegistry],
    }),
  ],
  providers: [ConfigFactoryService],
  exports: [ConfigFactoryService],
})
export class ConfigFactoryGlobalModule {}
