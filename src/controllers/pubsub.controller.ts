import { Controller, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PostPubSubPubSub } from '@/decorators/controller.method.decorators';
import { RealmUpsertRealmBody } from '@/decorators/controller.parameter.decorators';
import { OpenApi_PubSub } from '@/decorators/open-api.controller.decorators';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { ParseYmlInterceptor } from '@/interceptors/parse-yml.interceptor';
import { PubSubService } from '@/services/pubsub.service';

@ApiTags('PubSubs')
@Controller('pubsubs')
@UseInterceptors(ParseYmlInterceptor)
export class PubSubController {
  constructor(private readonly pubsubService: PubSubService) {}

  @PostPubSubPubSub()
  @OpenApi_PubSub()
  async upsertPubSubCaching(@RealmUpsertRealmBody() req: RealmsUpsertReq[]) {
    return await this.pubsubService.passThrough(req);
  }
}
