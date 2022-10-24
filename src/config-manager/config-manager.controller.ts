import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Controller, HttpCode, HttpStatus, Inject, UnprocessableEntityException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigFactoryService } from './configs/config-factory.service';
import {
  DeleteConfigIds,
  DeleteNamespace,
  GetByPagination,
  GetConfigIds,
  GetNamespace,
  PostNamespace,
} from './decorators/controller.method.decorator';
import { ConfigManagerUpsertBody, ParamConfigIds, ParamNamespace } from './decorators/controller.parameter.decorator';
import { QuerySkip, QueryTake } from './decorators/controller.query.decorators';
import {
  OpenApi_DeleteByNamespace,
  OpenApi_DeleteByNamespaceConfigIds,
  OpenApi_GetAllPagination,
  OpenApi_GetByNamespace,
  OpenApi_GetByNamespaceConfigIds,
  OpenApi_Upsert,
} from './decorators/open-api.controller.decorator';
import { ConfigManagerUpsertReq } from './dtos/config-manager-upsert-req.dto';
import { ConfigManagerService } from './services/config-manager.service';
import { reduceEntities } from './services/helpers/reduce-entities.helper';

@ApiTags('Config-Manager')
@Controller('namespaces')
export class ConfigManagerController {
  constructor(
    private readonly configManagerService: ConfigManagerService,
    private readonly configFactory: ConfigFactoryService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  @PostNamespace()
  @OpenApi_Upsert()
  async upsert(@ParamNamespace() namespace: string, @ConfigManagerUpsertBody() req: ConfigManagerUpsertReq[]) {
    const prefixId = `${this.configFactory.config.namespacePrefix}_${namespace}`;
    const entities = await this.configManagerService.upsert(namespace, req);
    const cache = (await this.cache.get(prefixId)) ?? ({} as any);
    await this.cache.set(prefixId, { ...cache, ...reduceEntities(req) }, this.configFactory.config.ttl);
    return entities;
  }

  @GetByPagination()
  @OpenApi_GetAllPagination()
  async getByPagination(@QueryTake() take: number, @QuerySkip() skip: number) {
    return await this.configManagerService.getByPagination(take, skip);
  }

  @GetNamespace()
  @OpenApi_GetByNamespace()
  async getByNamespace(@ParamNamespace() namespace: string) {
    const prefixId = `${this.configFactory.config.namespacePrefix}_${namespace}`;
    const entities = await this.configManagerService.getByNamespace(namespace);
    const cache = (await this.cache.get(prefixId)) ?? ({} as any);
    const data = { ...cache, ...reduceEntities(entities) };

    if (Object.keys(data)?.length) {
      await this.cache.set(prefixId, data, this.configFactory.config.ttl);
      return data;
    }

    throw new UnprocessableEntityException(`N/A namespace: ${namespace}`);
  }

  @GetConfigIds()
  @OpenApi_GetByNamespaceConfigIds()
  async getByNamespaceConfigIds(@ParamNamespace() namespace: string, @ParamConfigIds() configIds: string[]) {
    const prefixId = `${this.configFactory.config.namespacePrefix}_${namespace}`;
    const ids = Array.from(new Set(configIds.filter((e) => e)));
    let cache = (await this.cache.get(prefixId)) ?? ({} as any);
    const matchedKeys = Object.keys(cache).filter((c) => ids.includes(c));

    if (matchedKeys?.length) cache = matchedKeys.reduce((acc, key) => ({ ...acc, [key]: cache[key] }), {});

    if (matchedKeys?.length === ids?.length) return cache;

    const entities = await this.configManagerService.getByNamespaceConfigIds(namespace, ids);

    const upsertCache = { ...cache, ...entities };
    await this.cache.set(prefixId, upsertCache, this.configFactory.config.ttl);
    return upsertCache;
  }

  @DeleteNamespace()
  @OpenApi_DeleteByNamespace()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteByNamespace(@ParamNamespace() namespace: string) {
    await this.cache.del(`${this.configFactory.config.namespacePrefix}_${namespace}`);
    await this.configManagerService.deleteByNamespace(namespace);
  }

  @DeleteConfigIds()
  @OpenApi_DeleteByNamespaceConfigIds()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteByConfigIds(@ParamNamespace() namespace: string, @ParamConfigIds() configIds: string[]) {
    const prefixId = `${this.configFactory.config.namespacePrefix}_${namespace}`;
    const ids = Array.from(new Set(configIds.filter((e) => e)));
    const cache = (await this.cache.get(prefixId)) ?? ({} as any);
    const keys = Object.keys(cache).filter((key) => delete cache[configIds.find((id) => id === key)]);

    if (keys.length) await this.cache.set(prefixId, cache, this.configFactory.config.ttl);
    else await this.cache.del(prefixId);
    await this.configManagerService.deleteByNamespaceConfigId(namespace, ids);
  }
}
