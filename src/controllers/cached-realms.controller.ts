import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, HttpCode, HttpStatus, Inject, UnprocessableEntityException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';

import { DeleteConfigIds, DeleteRealm, GetConfigIds, GetRealm } from '@/decorators/controller.method.decorators';
import { ParamRealm, QueryConfigIds } from '@/decorators/controller.parameter.decorators';
import {
  OpenApi_DeleteRealm,
  OpenApi_DeleteRealmConfigIds,
  OpenApi_GetRealm,
  OpenApi_GetRealmConfigIds,
} from '@/decorators/open-api.controller.decorators';
import { reduceToConfigs } from '@/helpers/reduce-to-configs.helper';
import { ConfigFactoryService } from '@/services/config-factory.service';
import { RealmsService } from '@/services/realms.service';

@ApiTags('Cached')
@Controller('realms')
export class CachedRealmsController {
  constructor(
    private readonly realmsService: RealmsService,
    private readonly configFactory: ConfigFactoryService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  @GetRealm()
  @OpenApi_GetRealm()
  async getRealm(@ParamRealm() realm: string) {
    const postfix = `$${realm} @${this.configFactory.config.namespacePostfix}`;
    const cache = (await this.cache.get(postfix)) ?? ({} as any);
    if (Object.keys(cache)?.length) return cache;
    const data = reduceToConfigs(this.configFactory.config.resolveEnv, await this.realmsService.getRealm(realm));
    if (!Object.keys(data)?.length) throw new UnprocessableEntityException(`N/A realm: ${realm}`);
    await this.cache.set(postfix, data, this.configFactory.config.ttl);
    return data;
  }

  @GetConfigIds()
  @OpenApi_GetRealmConfigIds()
  async getRealmConfigIds(@ParamRealm() realm: string, @QueryConfigIds() configIds: string[]) {
    const postfix = `$${realm} @${this.configFactory.config.namespacePostfix}`;
    const ids = Array.from(new Set(configIds.filter((e) => e)));
    let cache = (await this.cache.get(postfix)) ?? ({} as any);
    const matchedKeys = Object.keys(cache).filter((c) => ids.includes(c));
    if (matchedKeys?.length) cache = matchedKeys.reduce((acc, key) => ({ ...acc, [key]: cache[key] }), {});
    if (matchedKeys?.length === ids?.length) return cache;
    const entities = await this.realmsService.getRealmConfigIds(realm, ids);
    cache = { ...cache, ...entities };
    await this.cache.set(postfix, cache, this.configFactory.config.ttl);
    return cache;
  }

  @DeleteRealm()
  @OpenApi_DeleteRealm()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRealm(@ParamRealm() realm: string) {
    await this.cache.del(`${realm}_${this.configFactory.config.namespacePostfix}`);
    await this.realmsService.deleteRealm(realm);
  }

  @DeleteConfigIds()
  @OpenApi_DeleteRealmConfigIds()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRealmConfigIds(@ParamRealm() realm: string, @QueryConfigIds() configIds: string[]) {
    const postfix = `$${realm} @${this.configFactory.config.namespacePostfix}`;
    const ids = Array.from(new Set(configIds.filter((e) => e)));
    const cache = (await this.cache.get(postfix)) ?? ({} as any);
    const keys = Object.keys(cache).filter((key) => delete cache[configIds.find((id) => id === key)]);
    await this.realmsService.deleteRealmConfigIds(realm, ids);
    if (keys.length) await this.cache.set(postfix, cache, this.configFactory.config.ttl);
    else await this.cache.del(postfix);
  }
}
