import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppConfigRegistry } from '@/configs/app/registry.dbs';
import { BullMQRegistry } from '@/configs/bullmq/registry.dbs';
import { MongoConfigRegistry } from '@/configs/mongo/registry.dbs';
import { RealmRegistry } from '@/configs/realms/registry.dbs';
import { RedisConfigRegistry } from '@/configs/redis/registry.dbs';
import { RedisPubSubRegistry } from '@/configs/redis-pubsub/registry.dbs';
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
      load: [
        AppConfigRegistry,
        MongoConfigRegistry,
        RedisConfigRegistry,
        RealmRegistry,
        RedisPubSubRegistry,
        BullMQRegistry,
      ],
    }),
  ],
  providers: [ConfigFactoryService],
  exports: [ConfigFactoryService],
})
export class GlobalConfigFactoryModule {}
