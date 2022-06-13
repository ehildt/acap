import {
  Controller,
  Delete,
  Get,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
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
import { ConfigManagerService } from './services/config-manager.service';

@ApiTags('Config-Manager')
@Controller('configs/services')
export class ConfigManagerController {
  constructor(
    private readonly configManagerService: ConfigManagerService,
    private readonly cacheManagerService: CacheManagerService,
  ) {}

  @Post(serviceId)
  @OpenApi_Upsert()
  async upsert(
    @ServiceIdParam() serviceId: string,
    @ConfigManagerUpsertBody() req: ConfigManagerUpsertReq[],
  ) {
    const entities = await this.configManagerService.upsert(serviceId, req);
    await this.cacheManagerService.upsert(serviceId, req);
    return entities;
  }

  @Get(serviceId)
  @OpenApi_GetByServiceId()
  async getByServiceId(@ServiceIdParam() serviceId: string) {
    const entities = await this.configManagerService.getByServiceId(serviceId);
    return this.cacheManagerService.upsertFromEntities(serviceId, entities);
  }

  @Get(serviceIdConfigIds)
  @OpenApi_GetByServiceIdConfigIds()
  async getByServiceIdConfigIds(
    @ServiceIdParam() serviceId: string,
    @ConfigIdsParam() configIds: string[],
  ) {
    const ids = Array.from(new Set(configIds.filter((e) => e)));
    const cache = await this.cacheManagerService.getByServiceIdConfigIds(
      serviceId,
      ids,
    );

    if (cache) return cache;

    const entities = await this.configManagerService.getByServiceIdConfigIds(
      serviceId,
      ids,
    );

    if (Object.keys(entities)?.length < ids?.length)
      throw new UnprocessableEntityException({
        message: `N/A (config): ${ids.filter(
          (id) => !Object.keys(entities).find((k) => k === id),
        )}`,
      });

    const upsertCache = { ...cache, ...entities };
    await this.cacheManagerService.upsertFromEntities(serviceId, upsertCache);
    return upsertCache;
  }

  @Delete(serviceId)
  @OpenApi_DeleteByServiceId()
  async deleteByServiceId(@ServiceIdParam() serviceId: string) {
    await this.cacheManagerService.deleteByServiceId(serviceId);
    return this.configManagerService.deleteByServiceId(serviceId);
  }

  @Delete(serviceIdConfigIds)
  @OpenApi_DeleteByServiceIdConfigIds()
  async deleteByConfigIds(
    @ServiceIdParam() serviceId: string,
    @ConfigIdsParam() configIds: string[],
  ) {
    const ids = Array.from(new Set(configIds.filter((e) => e)));
    await this.cacheManagerService.deleteByServiceIdConfigId(serviceId, ids);
    return this.configManagerService.deleteByServiceIdConfigId(serviceId, ids);
  }
}
