import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PostRealm } from '@/decorators/controller.method.decorators';
import {
  ParamRealm,
  QueryRealms,
  RealmUpsertBody,
  RealmUpsertRealmBody,
} from '@/decorators/controller.parameter.decorators';
import { QuerySkip, QueryTake } from '@/decorators/controller.query.decorators';
import { OpenApi_GetRealms, OpenApi_Upsert, OpenApi_UpsertRealms } from '@/decorators/open-api.controller.decorators';
import { RealmUpsertReq } from '@/dtos/realm-upsert-req.dto';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { RealmsService } from '@/services/realms.service';

@ApiTags('Persisted')
@Controller('realms')
export class PersistedRealmsController {
  constructor(private readonly realmsService: RealmsService) {}

  @PostRealm()
  @OpenApi_Upsert()
  async upsert(@ParamRealm() realm: string, @RealmUpsertBody() req: RealmUpsertReq[]) {
    return await this.realmsService.upsertRealm(realm, req);
  }

  @Post()
  @OpenApi_UpsertRealms()
  async upsertRealms(@RealmUpsertRealmBody() req: RealmsUpsertReq[]) {
    return await this.realmsService.upsertRealms(req);
  }

  @Get()
  @OpenApi_GetRealms()
  async getRealms(@QueryRealms() realms?: string[], @QueryTake() take?: number, @QuerySkip() skip?: number) {
    if (!realms) return await this.realmsService.paginate(take ?? 100, skip ?? 0);
    return await this.realmsService.getRealms(realms);
  }
}
