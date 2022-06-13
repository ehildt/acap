import { Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ConfigIdsParam,
  ConfigManagerUpsertBody,
  serviceId,
  serviceIdConfigIds,
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

  @Post(serviceId)
  @OpenApi_Upsert()
  async upsert(
    @ServiceIdParam() serviceId: string,
    @ConfigManagerUpsertBody() req: ConfigManagerUpsertReq[],
  ) {
    return this.cacheManagerService.upsert(serviceId, req);
  }

  @Get(serviceId)
  @OpenApi_GetByServiceId()
  async getByServiceId(@ServiceIdParam() serviceId: string) {
    return this.cacheManagerService.getByServiceId(serviceId);
  }

  @Get(serviceIdConfigIds)
  @OpenApi_GetByServiceIdConfigIds()
  async getByServiceIdConfigIds(
    @ServiceIdParam() serviceId: string,
    @ConfigIdsParam() configIds: string[],
  ) {
    const ids = Array.from(new Set(configIds.filter((e) => e)));
    return this.cacheManagerService.getByServiceIdConfigIds(serviceId, ids);
  }

  @Delete(serviceId)
  @OpenApi_DeleteByServiceId()
  async deleteByServiceId(@ServiceIdParam() serviceId: string) {
    return this.cacheManagerService.deleteByServiceId(serviceId);
  }

  @Delete(serviceIdConfigIds)
  @OpenApi_DeleteByServiceIdConfigIds()
  async deleteByServiceIdConfigIds(
    @ServiceIdParam() serviceId: string,
    @ConfigIdsParam() configIds: string[],
  ) {
    const ids = Array.from(new Set(configIds.filter((e) => e)));
    return this.cacheManagerService.deleteByServiceIdConfigId(serviceId, ids);
  }
}