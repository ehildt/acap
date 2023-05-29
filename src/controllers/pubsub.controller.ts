import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PostPassThroughPubSub } from '@/decorators/controller.method.decorators';
import { ConfigManagerUpsertRealmBody } from '@/decorators/controller.parameter.decorators';
import { OpenApi_PassThrough } from '@/decorators/open-api.controller.decorators';
import { ConfigManagerUpsertRealmReq } from '@/dtos/config-manager-upsert-by-realm.dto.req';
import { PubSubService } from '@/services/pubsub.service';

@ApiTags('PubSub')
@Controller('pubsubs')
export class PubSubController {
  constructor(private readonly pubsubService: PubSubService) {}

  @PostPassThroughPubSub()
  @OpenApi_PassThrough()
  async upsertPassThroughCaching(@ConfigManagerUpsertRealmBody() req: ConfigManagerUpsertRealmReq[]) {
    return await this.pubsubService.passThrough(req);
  }
}
