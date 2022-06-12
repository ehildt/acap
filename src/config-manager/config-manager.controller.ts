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
import { ConfigManagerService } from './services/config-manager.service';

@ApiTags('Config-Manager')
@Controller('configs/services')
export class ConfigManagerController {
  constructor(
    private readonly managerConfig: ConfigManagerService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Post(namespace)
  @OpenApi_Upsert()
  async upsert(
    @ServiceIdParam() namespace: string,
    @ConfigManagerUpsertBody() req: ConfigManagerUpsertReq[],
  ) {
    const entities = await this.managerConfig.upsert(namespace, req);
    const cache = (await this.cacheManager.get(namespace)) ?? ({} as any);

    const data = {
      ...cache,
      ...req.reduce(
        (acc, { configId, value }) => ({ ...acc, [configId]: value }),
        {},
      ),
    };

    await this.cacheManager.set(namespace, data);
    return entities;
  }

  @Get(namespace)
  @OpenApi_GetByServiceId()
  async getByServiceId(@ServiceIdParam() namespace: string) {
    const entities = await this.managerConfig.getByServiceId(namespace);
    const cache = (await this.cacheManager.get(namespace)) ?? ({} as any);

    const data = {
      ...cache,
      ...entities.reduce(
        (acc, { configId, value }) => ({ ...acc, [configId]: value }),
        {},
      ),
    };

    await this.cacheManager.set(namespace, data);
    return entities;
  }

  @Get(namespaceConfigIds)
  @OpenApi_GetByServiceIdConfigIds()
  async getByServiceIdConfigIds(
    @ServiceIdParam() namespace: string,
    @ConfigIdsParam() configIds: string[],
  ) {
    const cache = (await this.cacheManager.get(namespace)) ?? ({} as any);
    const keys = Object.keys(cache).filter((c) => configIds.includes(c));

    if (keys?.length === configIds?.length)
      return keys.reduce((acc, key) => ({ ...acc, [key]: cache[key] }), {});

    const entities = await this.managerConfig.getByServiceIdConfigIds(
      namespace,
      configIds,
    );

    if (Object.keys(entities)?.length !== configIds?.length)
      throw new HttpException(
        {
          message: `N/A (config): ${configIds.filter(
            (id) => !Object.keys(entities).find((k) => k === id),
          )}`,
          status: HttpStatus.UNPROCESSABLE_ENTITY,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    const upsertCache = { ...cache, ...entities };
    await this.cacheManager.set(namespace, upsertCache);
    return upsertCache;
  }

  @Delete(namespace)
  @OpenApi_DeleteByServiceId()
  async deleteByServiceId(@ServiceIdParam() namespace: string) {
    await this.cacheManager.del(namespace);
    return this.managerConfig.deleteByServiceId(namespace);
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

    if (keys.length) {
      await this.cacheManager.set(namespace, cache);
      return await this.managerConfig.deleteByServiceIdConfigId(
        namespace,
        configIds,
      );
    }

    await this.cacheManager.del(namespace);
    return this.deleteByServiceId(namespace);
  }
}
