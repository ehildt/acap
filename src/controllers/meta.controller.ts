import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { QuerySkip, QueryTake } from '@/decorators/controller.query.decorators';
import { OpenApi_GetRealmMeta, OpenApi_GetSchemaMeta } from '@/decorators/open-api.controller.decorators';
import { MetaService } from '@/services/meta.service';

@ApiTags('Meta')
@Controller('meta')
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  @Get('realm')
  @OpenApi_GetRealmMeta()
  async getRealmMeta(@QueryTake() take: number, @QuerySkip() skip: number) {
    return await this.metaService.getRealmMeta(take, skip);
  }

  @Get('schema')
  @OpenApi_GetSchemaMeta()
  async getSchemaMeta(@QueryTake() take: number, @QuerySkip() skip: number) {
    return await this.metaService.getSchemaMeta(take, skip);
  }
}
