import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, HttpCode, HttpStatus, Inject, UnprocessableEntityException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';

import { DeleteRealm, GetRealm } from '@/decorators/controller.method.decorators';
import { ParamRealm, QueryConfigIds, QueryRealm } from '@/decorators/controller.parameter.decorators';
import { OpenApi_DeleteRealm, OpenApi_GetRealm } from '@/decorators/open-api.controller.decorators';
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
  async getRealm(@QueryRealm() realm: string, @QueryConfigIds() configIds?: string[]) {
    const postfix = `$${realm} @${this.configFactory.config.namespacePostfix}`;
    let cache = (await this.cache.get(postfix)) ?? ({} as any);

    if (!configIds) {
      if (Object.keys(cache)?.length) return cache;
      const data = reduceToConfigs(this.configFactory.config.resolveEnv, await this.realmsService.getRealm(realm));
      if (!Object.keys(data)?.length) throw new UnprocessableEntityException(`N/A realm: ${realm}`);
      await this.cache.set(postfix, data, this.configFactory.config.ttl);
      return data;
    }

    const ids = Array.from(new Set(configIds.filter((e) => e)));
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
  async deleteRealm(@ParamRealm() realm: string, @QueryConfigIds() configIds?: string[]) {
    const postfix = `$${realm} @${this.configFactory.config.namespacePostfix}`;

    if (!configIds) {
      await this.cache.del(`${realm}_${this.configFactory.config.namespacePostfix}`);
      return await this.realmsService.deleteRealm(realm);
    }

    const ids = Array.from(new Set(configIds.filter((e) => e)));
    const cache = (await this.cache.get(postfix)) ?? ({} as any);
    const keys = Object.keys(cache).filter((key) => delete cache[configIds.find((id) => id === key)]);
    await this.realmsService.deleteRealmConfigIds(realm, ids);
    if (keys.length) await this.cache.set(postfix, cache, this.configFactory.config.ttl);
    else return await this.cache.del(postfix);
  }
}
