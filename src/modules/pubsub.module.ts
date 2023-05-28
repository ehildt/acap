import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';

import { Publisher } from '@/constants/publisher.enum';
import { PubSubController } from '@/controllers/pubsub.controller';
import { ConfigFactoryService } from '@/services/config-factory.service';
import { PubSubService } from '@/services/pubsub.service';

@Global()
@Module({
  imports: [
    // make this global
    ClientsModule.registerAsync([
      {
        name: Publisher.TOKEN,
        imports: [ConfigModule],
        extraProviders: [ConfigFactoryService],
        inject: [ConfigFactoryService],
        useFactory: ({ publisher }: ConfigFactoryService) => publisher,
      },
    ]),
  ],
  providers: [PubSubService],
  controllers: [PubSubController],
})
export class PubSubGlobalModule {}
