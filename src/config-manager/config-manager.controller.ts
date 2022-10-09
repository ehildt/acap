import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Controller, HttpCode, HttpStatus, Inject, UnprocessableEntityException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigFactoryService } from './configs/config-factory.service';
import {
  DeleteConfigIds,
  DeleteServiceId,
  GetConfigIds,
  GetServiceId,
  PostServiceId,
} from './decorators/controller.method.decorator';
import { ConfigManagerUpsertBody, ParamConfigIds, ParamServiceId } from './decorators/controller.parameter.decorator';
import {
  OpenApi_DeleteByServiceId,
  OpenApi_DeleteByServiceIdConfigIds,
  OpenApi_GetByServiceId,
  OpenApi_GetByServiceIdConfigIds,
  OpenApi_Upsert,
} from './decorators/open-api.controller.decorator';
import { ConfigManagerUpsertReq } from './dtos/config-manager-upsert-req.dto';
import { ConfigManagerService } from './services/config-manager.service';
import { reduceEntities } from './services/helpers/reduce-entities.helper';

@ApiTags('Config-Manager')
@Controller('configs/services')
export class ConfigManagerController {
  constructor(
    private readonly configManagerService: ConfigManagerService,
    private readonly configFactory: ConfigFactoryService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  @PostServiceId()
  @OpenApi_Upsert()
  async upsert(@ParamServiceId() serviceId: string, @ConfigManagerUpsertBody() req: ConfigManagerUpsertReq[]) {
    const prefixId = `${this.configFactory.config.namespacePrefix}_${serviceId}`;
    const entities = await this.configManagerService.upsert(serviceId, req);
    const cache = (await this.cache.get(prefixId)) ?? ({} as any);
    await this.cache.set(prefixId, { ...cache, ...reduceEntities(req) }, this.configFactory.config.ttl);
    return entities;
  }

  @GetServiceId()
  @OpenApi_GetByServiceId()
  async getByServiceId(@ParamServiceId() serviceId: string) {
    const prefixId = `${this.configFactory.config.namespacePrefix}_${serviceId}`;
    const entities = await this.configManagerService.getByServiceId(serviceId);
    const cache = (await this.cache.get(prefixId)) ?? ({} as any);
    const data = { ...cache, ...reduceEntities(entities) };

    if (Object.keys(data)?.length) {
      await this.cache.set(prefixId, data, this.configFactory.config.ttl);
      return data;
    }

    throw new UnprocessableEntityException(`N/A serviceId: ${serviceId}`);
  }

  @GetConfigIds()
  @OpenApi_GetByServiceIdConfigIds()
  async getByServiceIdConfigIds(@ParamServiceId() serviceId: string, @ParamConfigIds() configIds: string[]) {
    const prefixId = `${this.configFactory.config.namespacePrefix}_${serviceId}`;
    const ids = Array.from(new Set(configIds.filter((e) => e)));
    let cache = (await this.cache.get(prefixId)) ?? ({} as any);
    const matchedKeys = Object.keys(cache).filter((c) => ids.includes(c));

    if (matchedKeys?.length) cache = matchedKeys.reduce((acc, key) => ({ ...acc, [key]: cache[key] }), {});

    if (matchedKeys?.length === ids?.length) return cache;

    const entities = await this.configManagerService.getByServiceIdConfigIds(serviceId, ids);

    const upsertCache = { ...cache, ...entities };
    await this.cache.set(prefixId, upsertCache, this.configFactory.config.ttl);
    return upsertCache;
  }

  @DeleteServiceId()
  @OpenApi_DeleteByServiceId()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteByServiceId(@ParamServiceId() serviceId: string) {
    await this.cache.del(`${this.configFactory.config.namespacePrefix}_${serviceId}`);
    await this.configManagerService.deleteByServiceId(serviceId);
  }

  @DeleteConfigIds()
  @OpenApi_DeleteByServiceIdConfigIds()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteByConfigIds(@ParamServiceId() serviceId: string, @ParamConfigIds() configIds: string[]) {
    const prefixId = `${this.configFactory.config.namespacePrefix}_${serviceId}`;
    const ids = Array.from(new Set(configIds.filter((e) => e)));
    const cache = (await this.cache.get(prefixId)) ?? ({} as any);
    const keys = Object.keys(cache).filter((key) => delete cache[configIds.find((id) => id === key)]);

    if (keys.length) await this.cache.set(prefixId, cache, this.configFactory.config.ttl);
    else await this.cache.del(prefixId);
    await this.configManagerService.deleteByServiceIdConfigId(serviceId, ids);
  }
}
