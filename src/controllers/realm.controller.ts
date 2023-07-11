import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UnprocessableEntityException,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';

import { DeleteRealm, GetRealm, GetRealmConfig, PostRealm } from '@/decorators/controller.method.decorators';
import {
  ParamId,
  ParamRealm,
  QueryIds,
  QueryRealm,
  QueryRealms,
  RealmUpsertBody,
  RealmUpsertRealmBody,
} from '@/decorators/controller.parameter.decorators';
import { QuerySkip, QueryTake } from '@/decorators/controller.query.decorators';
import {
  OpenApi_DeleteRealm,
  OpenApi_GetRealm,
  OpenApi_GetRealmConfig,
  OpenApi_GetRealms,
  OpenApi_Upsert,
  OpenApi_UpsertRealms,
} from '@/decorators/open-api.controller.decorators';
import { RealmUpsertReq } from '@/dtos/realm-upsert-req.dto';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { CacheObject, gunzipSyncCacheObject } from '@/helpers/gunzip-sync-cache-object.helper';
import { gzipSyncCacheObject } from '@/helpers/gzip-sync-cache-object.helper';
import { prepareCacheKey } from '@/helpers/prepare-cache-key.helper';
import { reduceToConfigs } from '@/helpers/reduce-to-configs.helper';
import { ParseYmlInterceptor } from '@/interceptors/parse-yml.interceptor';
import { AvjService } from '@/services/avj.service';
import { ConfigFactoryService } from '@/services/config-factory.service';
import { RealmService } from '@/services/realm.service';
import { SchemaService } from '@/services/schema.service';

@ApiTags('Configs')
@Controller('configs')
export class RealmController {
  constructor(
    private readonly avjService: AvjService,
    private readonly realmService: RealmService,
    private readonly schemaService: SchemaService,
    private readonly configFactory: ConfigFactoryService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  @GetRealmConfig()
  @OpenApi_GetRealmConfig()
  async getRealmConfig(@ParamRealm() realm: string, @ParamId() id: string) {
    const postfix = prepareCacheKey('REALM', realm, this.configFactory.config.namespacePostfix);
    const cache = gunzipSyncCacheObject(await this.cache.get<CacheObject>(postfix));
    const matchedKey = Object.keys(cache).find((key) => key === id);
    if (matchedKey) return cache[matchedKey];
    const data = await this.realmService.getRealmConfigIds(realm, [id]);
    if (!Object.keys(data)?.length) throw new UnprocessableEntityException(`N/A realm: ${realm}`);
    const cacheData = gzipSyncCacheObject({ ...cache, ...data }, this.configFactory.config.gzipThreshold);
    await this.cache.set(postfix, cacheData, this.configFactory.config.ttl);
    if (data[id]) return data[id];
    throw new UnprocessableEntityException(`N/A realm: ${realm} | id: ${id}`);
  }

  @GetRealm()
  @OpenApi_GetRealm()
  async getRealm(@QueryRealm() realm: string, @QueryIds() ids?: string[]) {
    const postfix = prepareCacheKey('REALM', realm, this.configFactory.config.namespacePostfix);
    let cache = gunzipSyncCacheObject(await this.cache.get<CacheObject>(postfix));

    if (!ids) {
      // ! we might want to keep track of how many configs are loaded
      // and in case not all are in ram, only then fetch for the whole realm
      if (Object.keys(cache)?.length) return cache;
      const data = reduceToConfigs(this.configFactory.config.resolveEnv, await this.realmService.getRealm(realm));
      if (!Object.keys(data)?.length) throw new UnprocessableEntityException(`N/A realm: ${realm}`);
      const cacheData = gzipSyncCacheObject(data, this.configFactory.config.gzipThreshold);
      await this.cache.set(postfix, cacheData, this.configFactory.config.ttl);
      return data;
    }

    const filteredIds = Array.from(new Set(ids?.filter((e) => e)));
    const matchedKeys = Object.keys(cache).filter((c) => filteredIds.includes(c));
    if (matchedKeys?.length) cache = matchedKeys.reduce((acc, key) => ({ ...acc, [key]: cache[key] }), {});
    if (matchedKeys?.length === filteredIds?.length) return cache;
    const unmatchedKeys = filteredIds.filter((fk) => !matchedKeys.find((mk) => fk === mk));
    const entities = await this.realmService.getRealmConfigIds(realm, unmatchedKeys);
    const cacheObj = { ...cache, ...entities };
    cache = gzipSyncCacheObject(cacheObj, this.configFactory.config.gzipThreshold);
    await this.cache.set(postfix, cache, this.configFactory.config.ttl);
    return cacheObj;
  }

  @PostRealm()
  @OpenApi_Upsert()
  @UseInterceptors(ParseYmlInterceptor)
  async upsertRealm(@ParamRealm() realm: string, @RealmUpsertBody() req: RealmUpsertReq[]) {
    const postfix = prepareCacheKey('REALM', realm, this.configFactory.config.namespacePostfix);
    // ! schema validation start
    try {
      const realmConfigKeys = req.map(({ id }) => id);
      const schemaConfigObject = await this.schemaService.getRealmConfigIds(realm, realmConfigKeys);
      req.forEach(({ value, id }) => this.avjService.validate(value, schemaConfigObject[id]));
    } catch (error) {
      // if error.status is defined, then this config has no schema and we go silent
      // otherwise the config validation must have failed and we throw an exception
      if (error.status === undefined) throw new ForbiddenException({ message: 'missing properties', required: error });
    }
    // ! schema validation end
    const cache = gunzipSyncCacheObject(await this.cache.get<CacheObject>(postfix));
    req.forEach(({ id, value }) => cache[id] && (cache[id] = value));
    const cacheObj = gzipSyncCacheObject(cache, this.configFactory.config.gzipThreshold);
    await this.cache.set(postfix, cacheObj, this.configFactory.config.ttl);
    return await this.realmService.upsertRealm(realm, req);
  }

  @Post()
  @OpenApi_UpsertRealms()
  @UseInterceptors(ParseYmlInterceptor)
  async upsertRealms(@RealmUpsertRealmBody() req: RealmsUpsertReq[]) {
    req.forEach(async ({ realm, configs }) => {
      const postfix = prepareCacheKey('REALM', realm, this.configFactory.config.namespacePostfix);
      const cache = gunzipSyncCacheObject(await this.cache.get<CacheObject>(postfix));
      configs.forEach(({ id, value }) => cache[id] && (cache[id] = value));
      const cacheObj = gzipSyncCacheObject(cache, this.configFactory.config.gzipThreshold);
      await this.cache.set(postfix, cacheObj, this.configFactory.config.ttl);
    });
    return await this.realmService.upsertRealms(req);
  }

  @DeleteRealm()
  @OpenApi_DeleteRealm()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRealm(@ParamRealm() realm: string, @QueryIds() ids?: string[]) {
    const postfix = prepareCacheKey('REALM', realm, this.configFactory.config.namespacePostfix);

    if (!ids) {
      await this.cache.del(postfix);
      return await this.realmService.deleteRealm(realm);
    }

    const filteredIds = Array.from(new Set(ids.filter((e) => e)));
    const cache = gunzipSyncCacheObject(await this.cache.get<CacheObject>(postfix));
    const keys = Object.keys(cache).filter((key) => delete cache[filteredIds.find((id) => id === key)]);
    await this.realmService.deleteRealmConfigIds(realm, filteredIds);

    if (keys.length) {
      const cacheObj = gzipSyncCacheObject(cache, this.configFactory.config.gzipThreshold);
      await this.cache.set(postfix, cacheObj, this.configFactory.config.ttl);
    } else return await this.cache.del(postfix);
  }

  @Get()
  @OpenApi_GetRealms()
  async getRealms(@QueryRealms() realms?: string[], @QueryTake() take?: number, @QuerySkip() skip?: number) {
    if (!realms) return await this.realmService.paginate(take ?? 100, skip ?? 0);
    return await this.realmService.getRealms(realms);
  }
}
