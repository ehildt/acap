import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PostPassThroughPubSub } from '@/decorators/controller.method.decorators';
import { RealmUpsertRealmBody } from '@/decorators/controller.parameter.decorators';
import { OpenApi_PassThrough } from '@/decorators/open-api.controller.decorators';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { PubSubService } from '@/services/pubsub.service';

@ApiTags('PubSub')
@Controller('pubsubs')
export class PubSubController {
  constructor(private readonly pubsubService: PubSubService) {}

  @PostPassThroughPubSub()
  @OpenApi_PassThrough()
  async upsertPassThroughCaching(@RealmUpsertRealmBody() req: RealmsUpsertReq[]) {
    return await this.pubsubService.passThrough(req);
  }
}
