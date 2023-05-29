import { MultipartFile } from '@fastify/multipart';
import { Controller, Get, Post, StreamableFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JsonFile } from '@/decorators/class.property.values';
import { DownloadFile, GetPagination, PostFile, PostRealm } from '@/decorators/controller.method.decorators';
import {
  ConfigManagerUpsertBody,
  ConfigManagerUpsertRealmBody,
  ParamRealm,
  QueryRealms,
} from '@/decorators/controller.parameter.decorators';
import { QuerySkip, QueryTake } from '@/decorators/controller.query.decorators';
import {
  OpenApi_DownloadFile,
  OpenApi_GetPagination,
  OpenApi_GetRealms,
  OpenApi_PostFile,
  OpenApi_Upsert,
  OpenApi_UpsertRealms,
} from '@/decorators/open-api.controller.decorators';
import { ConfigManagerUpsertRealmReq } from '@/dtos/config-manager-upsert-by-realm.dto.req';
import { ConfigManagerUpsertReq } from '@/dtos/config-manager-upsert-req.dto';
import { RealmsService } from '@/services/realms.service';

@ApiTags('Persisted')
@Controller('realms')
export class PersistedRealmsController {
  constructor(private readonly realmsService: RealmsService) {}

  @PostRealm()
  @OpenApi_Upsert()
  async upsert(@ParamRealm() realm: string, @ConfigManagerUpsertBody() req: ConfigManagerUpsertReq[]) {
    return await this.realmsService.upsertRealm(realm, req);
  }

  @Post()
  @OpenApi_UpsertRealms()
  async upsertRealms(@ConfigManagerUpsertRealmBody() req: ConfigManagerUpsertRealmReq[]) {
    return await this.realmsService.upsertRealms(req);
  }

  @GetPagination()
  @OpenApi_GetPagination()
  async paginate(@QueryTake() take: number, @QuerySkip() skip: number) {
    return await this.realmsService.paginate(take, skip);
  }

  @PostFile()
  @OpenApi_PostFile()
  async uploadFile(@JsonFile() file: MultipartFile) {
    const content = JSON.parse((await file.toBuffer()).toString());
    return await this.realmsService.upsertRealms(content);
  }

  @DownloadFile()
  @OpenApi_DownloadFile()
  async downloadConfigFile(@QueryRealms() realms?: string[]) {
    const file = await this.realmsService.downloadConfigFile(realms);
    return new StreamableFile(Buffer.from(JSON.stringify(file, null, 4)));
  }

  @Get()
  @OpenApi_GetRealms()
  async getRealms(@QueryRealms() realms: string[]) {
    return await this.realmsService.getRealms(realms);
  }
}
