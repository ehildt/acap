import { Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ConfigIdsParam,
  ConfigManagerUpsertBody,
  namespace,
  namespaceConfigIds,
  ServiceIdParam,
} from './decorators/controller-properties.decorator';
import {
  OpenApi_DeleteByServiceId,
  OpenApi_DeleteByServiceIdConfigIds,
  OpenApi_GetByServiceId,
  OpenApi_GetByServiceIdConfigIds,
  OpenApi_Upsert,
} from './decorators/open-api.decorator';
import { ConfigManagerUpsertReq } from './dtos/config-manager-upsert-req.dto';
import { CacheManagerService } from './services/cache-manager.service';

@ApiTags('Cache-Manager')
@Controller('caches/services')
export class CacheManagerController {
  constructor(private readonly cacheManagerService: CacheManagerService) {}

  @Post(namespace)
  @OpenApi_Upsert()
  async upsert(
    @ServiceIdParam() namespace: string,
    @ConfigManagerUpsertBody() req: ConfigManagerUpsertReq[],
  ) {
    return this.cacheManagerService.upsert(namespace, req);
  }

  @Get(namespace)
  @OpenApi_GetByServiceId()
  async getByServiceId(@ServiceIdParam() namespace: string) {
    return this.cacheManagerService.getByServiceId(namespace);
  }

  @Get(namespaceConfigIds)
  @OpenApi_GetByServiceIdConfigIds()
  async getByServiceIdConfigIds(
    @ServiceIdParam() namespace: string,
    @ConfigIdsParam() configIds: string[],
  ) {
    return this.cacheManagerService.getByServiceIdConfigIds(
      namespace,
      configIds,
    );
  }

  @Delete(namespace)
  @OpenApi_DeleteByServiceId()
  async deleteByServiceId(@ServiceIdParam() namespace: string) {
    return this.cacheManagerService.deleteByServiceId(namespace);
  }

  @Delete(namespaceConfigIds)
  @OpenApi_DeleteByServiceIdConfigIds()
  async deleteByServiceIdConfigIds(
    @ServiceIdParam() namespace: string,
    @ConfigIdsParam() configIds: string[],
  ) {
    return this.cacheManagerService.deleteByServiceIdConfigId(
      namespace,
      configIds,
    );
  }
}
