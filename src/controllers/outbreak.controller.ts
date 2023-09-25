import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PostOutbreak } from '@/decorators/controller.method.decorators';
import {
  QueryUseBullMQ,
  QueryUseMqtt,
  QueryUseRedisPubSub,
  RealmUpsertRealmBody,
} from '@/decorators/controller.parameter.decorators';
import { OpenApi_Outbreak } from '@/decorators/open-api.controller.decorators';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { OutbreakService } from '@/services/outbreak.service';

@ApiTags('Outbreaks')
@Controller('Outbreaks')
export class OutbreakController {
  constructor(private readonly outbreakService: OutbreakService) {}

  @PostOutbreak()
  @OpenApi_Outbreak()
  async upsertOutbreak(
    @RealmUpsertRealmBody() reqs: Array<RealmsUpsertReq>,
    @QueryUseMqtt() useMQTT = false,
    @QueryUseBullMQ() useBullMQ = false,
    @QueryUseRedisPubSub() useRedisPubSub = false,
  ) {
    return await this.outbreakService.delegate(reqs, { useBullMQ, useMQTT, useRedisPubSub });
  }
}
