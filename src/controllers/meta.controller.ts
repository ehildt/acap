import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GetMeta } from '@/decorators/controller.method.decorators';
import {
  ParamSource,
  QuerySearch,
  QuerySkip,
  QueryTake,
  QueryVerbose,
} from '@/decorators/controller.parameter.decorators';
import { OpenApi_GetMeta } from '@/decorators/open-api.controller.decorators';
import { MetaService } from '@/services/meta.service';

type META = 'realms' | 'schemas';

@ApiTags('Metae')
@Controller('metae')
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  @GetMeta()
  @OpenApi_GetMeta()
  async getRealmMeta(
    @ParamSource() metaSource: META,
    @QueryVerbose() verbose: boolean,
    @QueryTake() take: number,
    @QuerySkip() skip: number,
    @QuerySearch() search: string,
  ) {
    const filter = { take, skip, verbose, search };
    if (metaSource === 'realms') return await this.metaService.getRealmMeta(filter);
    if (metaSource === 'schemas') return await this.metaService.getSchemaMeta(filter);
  }
}
