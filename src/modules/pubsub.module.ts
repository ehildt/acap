import { Global, Module } from '@nestjs/common';

import { PubSubController } from '@/controllers/pubsub.controller';
import { PubSubService } from '@/services/pubsub.service';

@Global()
@Module({
  providers: [PubSubService],
  controllers: [PubSubController],
})
export class PubSubGlobalModule {}
