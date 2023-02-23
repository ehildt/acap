import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';

import { Publisher } from '@/constants/publisher.enum';
import { ConfigFactoryService } from '@/services/config-factory.service';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: Publisher.TOKEN,
        imports: [ConfigModule],
        extraProviders: [ConfigFactoryService],
        inject: [ConfigFactoryService],
        useFactory: async (configFactoryService: ConfigFactoryService) => configFactoryService.publisher,
      },
    ]),
  ],
  providers: [ConfigFactoryService],
  exports: [ClientsModule],
})
export class ClientsGlobalModule {}
