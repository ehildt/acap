import { Cache } from 'cache-manager';
import {
  BadRequestException,
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
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
import { ConfigManagerService } from './services/config-manager.service';

@ApiTags('Config-Manager')
@Controller('configs/services')
export class ConfigManagerController {
  constructor(
    private readonly managerConfig: ConfigManagerService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Post(serviceId)
  @OpenApi_Upsert()
  async upsert(
    @ServiceIdParam() serviceId: string,
    @ConfigManagerUpsertBody() req: ConfigManagerUpsertReq[],
  ) {
    return this.managerConfig.upsert(serviceId, req);
  }

  @Get(serviceId)
  @OpenApi_GetByServiceId()
  getByServiceId(@ServiceIdParam() serviceId: string) {
    return this.managerConfig.getByServiceId(serviceId);
  }

  // TODO CacheController
  // ! write cache controller and cache service
  @Get('caches/:serviceId')
  getByServiceIdCached(@ServiceIdParam() serviceId: string) {
    return this.managerConfig.getByServiceId(serviceId);
  }

  @Get(serviceIdConfigIds)
  @OpenApi_GetByServiceIdConfigIds()
  async getByServiceIdConfigIds(
    @ServiceIdParam() serviceId: string,
    @ConfigIdsParam() configIds: string[],
  ) {
    const cache = (await this.cacheManager.get(serviceId)) ?? ({} as any);
    const data = Object.keys(cache).filter((c) => configIds.includes(c));
    if (data?.length === configIds?.length) return cache;

    const entities = await this.managerConfig.getByServiceIdConfigIds(
      serviceId,
      configIds,
    );

    if (Object.keys(entities)?.length !== configIds?.length) {
      throw new BadRequestException(
        `configIds not found: ${configIds.filter(
          (id) => !Object.keys(entities).find((key) => key === id),
        )}`,
      );
    }

    const upsertCache = { ...cache, ...entities };
    await this.cacheManager.set(serviceId, upsertCache);
    return upsertCache;
  }

  @Delete(serviceId)
  @OpenApi_DeleteByServiceId()
  async deleteByServiceId(@ServiceIdParam() serviceId: string) {
    await this.cacheManager.del(serviceId);
    return this.managerConfig.deleteByServiceId(serviceId);
  }

  @Delete(serviceIdConfigIds)
  @OpenApi_DeleteByServiceIdConfigIds()
  deleteByConfigIds(
    @ServiceIdParam() serviceId: string,
    @ConfigIdsParam() configIds: string[],
  ) {
    // TODO deleteByServiceIdConfigId
    // ! also delete from cache
    return this.managerConfig.deleteByServiceIdConfigId(serviceId, configIds);
  }
}
