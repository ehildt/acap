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

@ApiTags('Cache-Manager')
@Controller('caches/services')
export class CacheManagerController {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  @Post(serviceId)
  @OpenApi_Upsert()
  async upsert(
    @ServiceIdParam() serviceId: string,
    @ConfigManagerUpsertBody() req: ConfigManagerUpsertReq[],
  ) {
    const cache = (await this.cacheManager.get(serviceId)) ?? ({} as any);

    const data = {
      ...cache,
      ...req.reduce(
        (acc, { configId, value }) => ({ ...acc, [configId]: value }),
        {},
      ),
    };

    return this.cacheManager.set(serviceId, data);
  }

  @Get(serviceId)
  @OpenApi_GetByServiceId()
  getByServiceId(@ServiceIdParam() serviceId: string) {
    return this.cacheManager.get(serviceId);
  }

  @Get(serviceIdConfigIds)
  @OpenApi_GetByServiceIdConfigIds()
  async getByServiceIdConfigIds(
    @ServiceIdParam() serviceId: string,
    @ConfigIdsParam() configIds: string[],
  ) {
    const cache = (await this.cacheManager.get(serviceId)) ?? ({} as any);
    const keys = Object.keys(cache);
    const matchedKeys = keys.filter((c) => configIds.includes(c));

    if (matchedKeys?.length === configIds?.length)
      return keys.reduce((acc, key) => ({ ...acc, [key]: cache[key] }), {});

    throw new BadRequestException(
      `configIds not found: ${configIds.filter(
        (id) => !keys.find((key) => key === id),
      )}`,
    );
  }

  @Delete(serviceId)
  @OpenApi_DeleteByServiceId()
  async deleteByServiceId(@ServiceIdParam() serviceId: string) {
    return this.cacheManager.del(serviceId);
  }

  @Delete(serviceIdConfigIds)
  @OpenApi_DeleteByServiceIdConfigIds()
  async deleteByConfigIds(
    @ServiceIdParam() serviceId: string,
    @ConfigIdsParam() configIds: string[],
  ) {
    const cache = (await this.cacheManager.get(serviceId)) ?? ({} as any);
    const keys = Object.keys(cache).filter(
      (key) => delete cache[configIds.find((id) => id === key)],
    );

    if (keys.length) await this.cacheManager.set(serviceId, cache);
    return this.cacheManager.del(serviceId);
  }
}
