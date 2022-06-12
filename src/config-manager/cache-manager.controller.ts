import { Cache } from 'cache-manager';
import {
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
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

const NO_CONTENT = 'NoContent';

@ApiTags('Cache-Manager')
@Controller('caches/services')
export class CacheManagerController {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  @Post(namespace)
  @OpenApi_Upsert()
  async upsert(
    @ServiceIdParam() namespace: string,
    @ConfigManagerUpsertBody() req: ConfigManagerUpsertReq[],
  ) {
    const cache = (await this.cacheManager.get(namespace)) ?? ({} as any);

    const data = {
      ...cache,
      ...req.reduce(
        (acc, { configId, value }) => ({ ...acc, [configId]: value }),
        {},
      ),
    };

    return this.cacheManager.set(namespace, data);
  }

  @Get(namespace)
  @OpenApi_GetByServiceId()
  async getByServiceId(@ServiceIdParam() namespace: string) {
    const cache = await this.cacheManager.get(namespace);
    if (!cache) throw new HttpException(NO_CONTENT, HttpStatus.NO_CONTENT);
    return cache;
  }

  @Get(namespaceConfigIds)
  @OpenApi_GetByServiceIdConfigIds()
  async getByServiceIdConfigIds(
    @ServiceIdParam() namespace: string,
    @ConfigIdsParam() configIds: string[],
  ) {
    const cache = (await this.cacheManager.get(namespace)) ?? ({} as any);
    const keys = Object.keys(cache);
    const matchedKeys = keys.filter((c) => configIds.includes(c));

    if (matchedKeys?.length === configIds?.length)
      return keys.reduce((acc, key) => ({ ...acc, [key]: cache[key] }), {});

    throw new HttpException(
      {
        message: `N/A (config): ${configIds.filter(
          (id) => !keys.find((k) => k === id),
        )}`,
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }

  @Delete(namespace)
  @OpenApi_DeleteByServiceId()
  async deleteByServiceId(@ServiceIdParam() namespace: string) {
    return this.cacheManager.del(namespace);
  }

  @Delete(namespaceConfigIds)
  @OpenApi_DeleteByServiceIdConfigIds()
  async deleteByConfigIds(
    @ServiceIdParam() namespace: string,
    @ConfigIdsParam() configIds: string[],
  ) {
    const cache = (await this.cacheManager.get(namespace)) ?? ({} as any);
    const keys = Object.keys(cache).filter(
      (key) => delete cache[configIds.find((id) => id === key)],
    );

    if (keys.length) await this.cacheManager.set(namespace, cache);
    return this.cacheManager.del(namespace);
  }
}
