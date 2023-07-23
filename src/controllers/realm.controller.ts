import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Controller, Get, Inject, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';

import {
  DeleteRealm,
  GetRealm,
  GetRealmConfig,
  PostRealm,
} from '@/controllers/decorators/controller.method.decorators';
import {
  ParamId,
  ParamRealm,
  QueryIds,
  QueryRealm,
  QueryRealms,
  RealmUpsertBody,
  RealmUpsertRealmBody,
} from '@/controllers/decorators/controller.parameter.decorators';
import { QuerySkip, QueryTake } from '@/controllers/decorators/controller.query.decorators';
import {
  OpenApi_DeleteRealm,
  OpenApi_GetRealm,
  OpenApi_GetRealmConfig,
  OpenApi_GetRealms,
  OpenApi_Upsert,
  OpenApi_UpsertRealms,
} from '@/controllers/decorators/open-api.controller.decorators';
import { ContentUpsertReq } from '@/dtos/content-upsert-req.dto';
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

@ApiTags('Contents')
@Controller('contents')
export class RealmController {
  constructor(
    private readonly avjService: AvjService,
    private readonly realmService: RealmService,
    private readonly schemaService: SchemaService,
    private readonly configFactory: ConfigFactoryService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  @GetRealm()
  @OpenApi_GetRealm()
  async getRealm(@QueryRealm() realm: string, @QueryIds() ids?: string[]) {
    const postfix = prepareCacheKey('REALM', realm, this.configFactory.config.namespacePostfix);
    const cache = gunzipSyncCacheObject(await this.cache.get<CacheObject>(postfix));
    if (!ids) {
      // ! we might want to keep track of how many configs are loaded
      // and in case not all are in ram, only then fetch for the whole realm
      if (Object.keys(cache.content)?.length === cache.count) return cache.content;
      const data = reduceToConfigs(this.configFactory.config.resolveEnv, await this.realmService.getRealm(realm));
      if (!Object.keys(data)?.length) throw new BadRequestException(`N/A realm: ${realm}`);
      const cacheData = gzipSyncCacheObject(data, this.configFactory.config.gzipThreshold, Object.keys(data).length);
      await this.cache.set(postfix, cacheData, this.configFactory.config.ttl);
      return cacheData.content;
    }

    const filteredIds = Array.from(new Set(ids?.filter((e) => e)));
    const matchedKeys = Object.keys(cache.content).filter((c) => filteredIds.includes(c));
    if (matchedKeys?.length)
      cache.content = matchedKeys.reduce((acc, key) => ({ ...acc, [key]: cache.content[key] }), {});
    if (matchedKeys?.length === filteredIds?.length) return cache.content;
    const unmatchedKeys = filteredIds.filter((fk) => !matchedKeys.find((mk) => fk === mk));
    const entities = await this.realmService.getRealmConfigIds(realm, unmatchedKeys);
    const count = await this.realmService.countRealmContents();
    const content = { ...cache.content, ...entities };
    cache.content = gzipSyncCacheObject(content, this.configFactory.config.gzipThreshold, count);
    await this.cache.set(postfix, cache.content, this.configFactory.config.ttl);
    return content;
  }

  @Get()
  @OpenApi_GetRealms()
  async getRealms(@QueryRealms() realms?: string[], @QueryTake() take?: number, @QuerySkip() skip?: number) {
    if (!realms) return await this.realmService.paginate(take ?? 100, skip ?? 0);
    return await this.realmService.getRealms(realms);
  }

  @PostRealm()
  @OpenApi_Upsert()
  @UseInterceptors(ParseYmlInterceptor)
  async upsertRealm(@ParamRealm() realm: string, @RealmUpsertBody() req: ContentUpsertReq[]) {
    const postfix = prepareCacheKey('REALM', realm, this.configFactory.config.namespacePostfix);
    // ! schema validation start
    try {
      const realmConfigKeys = Array.from(new Set(req.map(({ id }) => id)));
      const schemaConfigObject = await this.schemaService.getRealmConfigIds(realm, realmConfigKeys);
      req.forEach(({ value, id }) => this.avjService.validate(value, this.avjService.compile(schemaConfigObject[id])));
    } catch (error) {
      // if error.status is defined, then this config has no schema and we go silent
      // otherwise the config validation must have failed and we throw an exception
      if (error.status === undefined) throw new BadRequestException(error);
    }
    // ! schema validation end
    const entity = await this.realmService.upsertRealm(realm, req);
    const count = await this.realmService.countRealmContents();
    const cache = gunzipSyncCacheObject(await this.cache.get<CacheObject>(postfix));
    req.forEach(({ id, value }) => cache[id] && (cache[id] = value));
    const cacheObj = gzipSyncCacheObject(cache, this.configFactory.config.gzipThreshold, count);
    await this.cache.set(postfix, cacheObj, this.configFactory.config.ttl);
    return entity;
  }

  @Post()
  @OpenApi_UpsertRealms()
  @UseInterceptors(ParseYmlInterceptor)
  async upsertRealms(@RealmUpsertRealmBody() req: RealmsUpsertReq[]) {
    const tasks = req.map(async ({ realm, contents }) => {
      // ! schema validation start
      try {
        const realmConfigKeys = Array.from(new Set(contents.map(({ id }) => id)));
        const schemaConfigObject = await this.schemaService.getRealmConfigIds(realm, realmConfigKeys);
        contents.forEach(({ value, id }) =>
          this.avjService.validate(value, this.avjService.compile(schemaConfigObject[id])),
        );
      } catch (error) {
        // if error.status is defined, then this config has no schema and we go silent
        // otherwise the config validation must have failed and we throw an exception
        if (error.status === undefined) throw new BadRequestException(error);
      }
      // ! schema validation end
      const entity = await this.realmService.upsertRealm(realm, contents);
      const count = await this.realmService.countRealmContents();
      const postfix = prepareCacheKey('REALM', realm, this.configFactory.config.namespacePostfix);
      const { content } = gunzipSyncCacheObject(await this.cache.get<CacheObject>(postfix));
      contents.forEach(({ id, value }) => content[id] && (content[id] = value));
      const cacheObj = gzipSyncCacheObject(content, this.configFactory.config.gzipThreshold, count);
      await this.cache.set(postfix, cacheObj, this.configFactory.config.ttl);
      return entity;
    });
    return await Promise.all(tasks);
  }

  @GetRealmConfig()
  @OpenApi_GetRealmConfig()
  async getRealmConfig(@ParamRealm() realm: string, @ParamId() id: string) {
    const postfix = prepareCacheKey('REALM', realm, this.configFactory.config.namespacePostfix);
    const { content } = gunzipSyncCacheObject(await this.cache.get<CacheObject>(postfix));
    if (content[id]) return content[id];
    const data = await this.realmService.getRealmConfigIds(realm, [id]);
    const count = await this.realmService.countRealmContents();
    if (!Object.keys(data)?.length) throw new BadRequestException(`N/A realm: ${realm}`);
    const cacheData = gzipSyncCacheObject({ ...content, ...data }, this.configFactory.config.gzipThreshold, count);
    await this.cache.set(postfix, cacheData, this.configFactory.config.ttl);
    if (data[id]) return data[id];
    throw new BadRequestException(`N/A realm: ${realm} | id: ${id}`);
  }

  @DeleteRealm()
  @OpenApi_DeleteRealm()
  async deleteRealm(@ParamRealm() realm: string, @QueryIds() ids?: string[]) {
    const postfix = prepareCacheKey('REALM', realm, this.configFactory.config.namespacePostfix);

    if (!ids) {
      await this.cache.del(postfix);
      return await this.realmService.deleteRealm(realm);
    }

    const filteredIds = Array.from(new Set(ids.filter((e) => e)));
    const { content } = gunzipSyncCacheObject(await this.cache.get<CacheObject>(postfix));
    const result = await this.realmService.deleteRealmConfigIds(realm, filteredIds);
    const count = await this.realmService.countRealmContents();

    if (count) {
      Object.keys(content).filter((key) => delete content[filteredIds.find((id) => id === key)]);
      const cacheObj = gzipSyncCacheObject(content, this.configFactory.config.gzipThreshold, count);
      await this.cache.set(postfix, cacheObj, this.configFactory.config.ttl);
    } else await this.cache.del(postfix);

    return result;
  }
}
