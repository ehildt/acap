import { Cache } from 'cache-manager';
import {
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  AccessTokenGuard,
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
import { reduceEntities } from './services/helpers/reduce-entities.helper';

@ApiTags('Config-Manager')
@Controller('configs/services')
export class ConfigManagerController {
  constructor(
    private readonly configManagerService: ConfigManagerService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  @AccessTokenGuard()
  @Post(serviceId)
  @OpenApi_Upsert()
  async upsert(
    @ServiceIdParam() serviceId: string,
    @ConfigManagerUpsertBody() req: ConfigManagerUpsertReq[],
    @Query('ttlServiceId') ttl: number,
  ) {
    const entities = await this.configManagerService.upsert(serviceId, req);
    const cache = (await this.cache.get(serviceId)) ?? ({} as any);
    await this.cache.set(
      serviceId,
      { ...cache, ...reduceEntities(req) },
      { ttl },
    );
    return entities;
  }

  @AccessTokenGuard()
  @Get(serviceId)
  @OpenApi_GetByServiceId()
  async getByServiceId(@ServiceIdParam() serviceId: string) {
    const entities = await this.configManagerService.getByServiceId(serviceId);
    const cache = (await this.cache.get(serviceId)) ?? ({} as any);
    const data = { ...cache, ...reduceEntities(entities) };

    if (Object.keys(data)?.length) {
      await this.cache.set(serviceId, data);
      return data;
    }

    throw new UnprocessableEntityException(`N/A serviceId: ${serviceId}`);
  }

  @AccessTokenGuard()
  @Get(serviceIdConfigIds)
  @OpenApi_GetByServiceIdConfigIds()
  async getByServiceIdConfigIds(
    @ServiceIdParam() serviceId: string,
    @ConfigIdsParam() configIds: string[],
  ) {
    const ids = Array.from(new Set(configIds.filter((e) => e)));
    let cache = (await this.cache.get(serviceId)) ?? ({} as any);
    const matchedKeys = Object.keys(cache).filter((c) => ids.includes(c));

    if (matchedKeys?.length)
      cache = matchedKeys.reduce(
        (acc, key) => ({ ...acc, [key]: cache[key] }),
        {},
      );

    if (matchedKeys?.length === ids?.length) return cache;

    const entities = await this.configManagerService.getByServiceIdConfigIds(
      serviceId,
      ids,
    );

    const upsertCache = { ...cache, ...entities };
    await this.cache.set(serviceId, upsertCache);
    return upsertCache;
  }

  @AccessTokenGuard()
  @Delete(serviceId)
  @OpenApi_DeleteByServiceId()
  async deleteByServiceId(@ServiceIdParam() serviceId: string) {
    await this.cache.del(serviceId);
    return this.configManagerService.deleteByServiceId(serviceId);
  }

  @AccessTokenGuard()
  @Delete(serviceIdConfigIds)
  @OpenApi_DeleteByServiceIdConfigIds()
  async deleteByConfigIds(
    @ServiceIdParam() serviceId: string,
    @ConfigIdsParam() configIds: string[],
  ) {
    const ids = Array.from(new Set(configIds.filter((e) => e)));
    const cache = (await this.cache.get(serviceId)) ?? ({} as any);
    const keys = Object.keys(cache).filter(
      (key) => delete cache[configIds.find((id) => id === key)],
    );

    if (keys.length) await this.cache.set(serviceId, cache);
    else await this.cache.del(serviceId);
    return this.configManagerService.deleteByServiceIdConfigId(serviceId, ids);
  }
}
