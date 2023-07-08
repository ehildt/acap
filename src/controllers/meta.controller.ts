import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { QuerySkip, QueryTake } from '@/decorators/controller.query.decorators';
import { OpenApi_GetRealmMeta } from '@/decorators/open-api.controller.decorators';
import { MetaService } from '@/services/meta.service';

@ApiTags('Meta')
@Controller('meta')
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  @Get()
  @OpenApi_GetRealmMeta()
  async getMeta(@QueryTake() take: number, @QuerySkip() skip: number) {
    return await this.metaService.getMeta(take, skip);
  }
}
