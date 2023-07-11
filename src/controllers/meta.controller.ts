import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GetMeta } from '@/decorators/controller.method.decorators';
import { ParamSource } from '@/decorators/controller.parameter.decorators';
import { QuerySkip, QueryTake } from '@/decorators/controller.query.decorators';
import { OpenApi_GetMeta } from '@/decorators/open-api.controller.decorators';
import { MetaService } from '@/services/meta.service';

type META = 'realms' | 'schemas';

@ApiTags('Metae')
@Controller('metae')
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  @GetMeta()
  @OpenApi_GetMeta()
  async getRealmMeta(@ParamSource() metaSource: META, @QueryTake() take: number, @QuerySkip() skip: number) {
    if (metaSource === 'realms') return await this.metaService.getRealmMeta(take, skip);
    if (metaSource === 'schemas') return await this.metaService.getSchemaMeta(take, skip);
  }
}
