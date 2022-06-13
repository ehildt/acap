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
import { ConfigManagerService } from './services/config-manager.service';

@ApiTags('Config-Manager')
@Controller('configs/services')
export class ConfigManagerController {
  constructor(
    private readonly configManagerService: ConfigManagerService,
    private readonly cacheManagerService: CacheManagerService,
  ) {}

  @Post(namespace)
  @OpenApi_Upsert()
  async upsert(
    @ServiceIdParam() namespace: string,
    @ConfigManagerUpsertBody() req: ConfigManagerUpsertReq[],
  ) {
    const entities = await this.configManagerService.upsert(namespace, req);
    await this.cacheManagerService.upsert(namespace, req);
    return entities;
  }

  @Get(namespace)
  @OpenApi_GetByServiceId()
  async getByServiceId(@ServiceIdParam() namespace: string) {
    const entities = await this.configManagerService.getByServiceId(namespace);
    await this.cacheManagerService.upsertFromEntities(namespace, entities);
    return entities;
  }

  @Get(namespaceConfigIds)
  @OpenApi_GetByServiceIdConfigIds()
  async getByServiceIdConfigIds(
    @ServiceIdParam() namespace: string,
    @ConfigIdsParam() configIds: string[],
  ) {
    const cache = await this.cacheManagerService.getByServiceIdConfigIds(
      namespace,
      configIds,
    );

    if (cache) return cache;

    const entities = await this.configManagerService.getByServiceIdConfigIds(
      namespace,
      configIds,
    );

    if (Object.keys(entities)?.length !== configIds?.length)
      throw new UnprocessableEntityException({
        message: `N/A (config): ${configIds.filter(
          (id) => !Object.keys(entities).find((k) => k === id),
        )}`,
      });

    const upsertCache = { ...cache, ...entities };
    await this.cacheManagerService.upsertFromEntities(namespace, upsertCache);
    return upsertCache;
  }

  @Delete(namespace)
  @OpenApi_DeleteByServiceId()
  async deleteByServiceId(@ServiceIdParam() namespace: string) {
    await this.cacheManagerService.deleteByServiceId(namespace);
    return this.configManagerService.deleteByServiceId(namespace);
  }

  @Delete(namespaceConfigIds)
  @OpenApi_DeleteByServiceIdConfigIds()
  async deleteByConfigIds(
    @ServiceIdParam() namespace: string,
    @ConfigIdsParam() configIds: string[],
  ) {
    await this.cacheManagerService.deleteByServiceIdConfigId(
      namespace,
      configIds,
    );

    return await this.configManagerService.deleteByServiceIdConfigId(
      namespace,
      configIds,
    );
  }
}
