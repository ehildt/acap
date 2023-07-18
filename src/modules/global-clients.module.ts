import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';

import { REDIS_PUBSUB } from '@/constants/app.constants';
import { ConfigFactoryService } from '@/services/config-factory.service';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: REDIS_PUBSUB,
        imports: [ConfigModule],
        extraProviders: [ConfigFactoryService],
        inject: [ConfigFactoryService],
        useFactory: async ({ redisPubSub }: ConfigFactoryService) => (redisPubSub.isUsed ? redisPubSub : {}),
      },
    ]),
  ],
  providers: [ConfigFactoryService],
  exports: [ClientsModule],
})
export class GlobalClientsModule {}
