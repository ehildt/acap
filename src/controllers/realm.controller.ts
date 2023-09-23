import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Inject, NotFoundException, Post, UnprocessableEntityException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';

import { REALM_PREFIX } from '@/constants/app.constants';
import { DeleteRealm, GetRealm, GetRealmContent, PostRealm } from '@/decorators/controller.method.decorators';
import {
  ParamId,
  ParamRealm,
  QueryIds,
  QueryRealm,
  RealmUpsertBody,
  RealmUpsertRealmBody,
} from '@/decorators/controller.parameter.decorators';
import {
  OpenApi_DeleteRealm,
  OpenApi_GetRealm,
  OpenApi_GetRealmContent,
  OpenApi_Upsert,
  OpenApi_UpsertRealms,
} from '@/decorators/open-api.controller.decorators';
import { ContentUpsertReq } from '@/dtos/content-upsert-req.dto';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { CacheObject, gunzipSyncCacheObject } from '@/helpers/gunzip-sync-cache-object.helper';
import { gzipSyncCacheObject } from '@/helpers/gzip-sync-cache-object.helper';
import { prepareCacheKey } from '@/helpers/prepare-cache-key.helper';
import { reduceToContents } from '@/helpers/reduce-to-contents.helper';
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
    const postfix = prepareCacheKey(REALM_PREFIX, realm, this.configFactory.app.realm.namespacePostfix);
    const cachedRealm = await this.cache.get<CacheObject>(postfix);
    const cache = gunzipSyncCacheObject(cachedRealm);

    if (!ids) {
      // @ we update the ttl if the cache holds the same amount of content ids
      // ! when upserting the realm, the cache is also upserted.
      if (Object.keys(cache.content)?.length === cache.count) {
        await this.cache.set(postfix, cachedRealm, this.configFactory.app.realm.ttl);
        return cache.content;
      }

      // @ if not all realm content ids are in cache when fetching the realm,
      // @ we fetch the whole realm, cache and return it.
      const data = reduceToContents(this.configFactory.app.realm.resolveEnv, await this.realmService.getRealm(realm));
      if (!Object.keys(data)?.length) throw new NotFoundException(`No such REALM::${realm}`);
      const cacheObj = gzipSyncCacheObject(data, this.configFactory.app.realm.gzipThreshold, Object.keys(data).length);
      await this.cache.set(postfix, cacheObj, this.configFactory.app.realm.ttl);
      return data;
    }

    let content: any;
    const filteredIds = Array.from(new Set(ids?.filter((e) => e)));
    const matchedKeys = Object.keys(cache.content).filter((c) => filteredIds.includes(c));
    if (matchedKeys?.length) content = matchedKeys.reduce((acc, key) => ({ ...acc, [key]: cache.content[key] }), {});
    if (matchedKeys?.length === filteredIds?.length) {
      // @ we reset the ttl
      await this.cache.set(postfix, cachedRealm, this.configFactory.app.realm.ttl);
      return content;
    }
    const unmatchedKeys = filteredIds.filter((fk) => !matchedKeys.find((mk) => fk === mk));
    const entities = await this.realmService.getRealmContentByIds(realm, unmatchedKeys);
    const count = await this.realmService.countRealmContents();
    content = { ...content, ...entities };
    const cacheObj = gzipSyncCacheObject(content, this.configFactory.app.realm.gzipThreshold, count);
    await this.cache.set(postfix, cacheObj, this.configFactory.app.realm.ttl);
    return content;
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
    if (realms) return await this.realmService.getRealms(realms);
    return {
      data: await this.realmService.paginate(take ?? 100, skip ?? 0),
      count: await this.realmService.countRealms(),
    };
  }

  @PostRealm()
  @OpenApi_Upsert()
  async upsertRealm(@ParamRealm() realm: string, @RealmUpsertBody() req: ContentUpsertReq[]) {
    // @ schema validation start
    try {
      const realmConfigKeys = Array.from(new Set(req.map(({ id }) => id)));
      const schemaConfigObject = await this.schemaService.getRealmContentByIds(realm, realmConfigKeys, false);
      req.forEach(({ value, id }) => this.avjService.validate(value, this.avjService.compile(schemaConfigObject[id])));
    } catch (error) {
      if (error.status !== 422) throw new UnprocessableEntityException(error);
    }
    // @ schema validation end
    // ! we don't cache schemas on upsert.
    // ! we don't want to spam the ram whenever we upsert
    // * we want to keep the cache up to date
    let payload: Array<ContentUpsertReq>;
    const entity = await this.realmService.upsertRealm(realm, payload ?? req);
    const postfix = prepareCacheKey(REALM_PREFIX, realm, this.configFactory.app.realm.namespacePostfix);
    const { content } = gunzipSyncCacheObject(await this.cache.get<CacheObject>(postfix));
    if (!Object.keys(content)?.length) return entity;
    const count = await this.realmService.countRealmContents();
    req.forEach(({ id, value }) => content[id] && (content[id] = value));
    const cacheObj = gzipSyncCacheObject(content, this.configFactory.app.realm.gzipThreshold, count);
    await this.cache.set(postfix, cacheObj, this.configFactory.app.realm.ttl);
    return entity;
  }

  @Post()
  @OpenApi_UpsertRealms()
  async upsertRealms(@RealmUpsertRealmBody() req: RealmsUpsertReq[]) {
    const tasks = req.map(async ({ realm, contents }) => {
      // @ schema validation start
      try {
        const realmConfigKeys = Array.from(new Set(contents.map(({ id }) => id)));
        const schemaConfigObject = await this.schemaService.getRealmContentByIds(realm, realmConfigKeys, false);
        contents.forEach(({ value, id }) =>
          this.avjService.validate(value, this.avjService.compile(schemaConfigObject[id])),
        );
      } catch (error) {
        if (error.status !== 422) throw new UnprocessableEntityException(error);
      }
      // @ schema validation end
      // ! we don't cache schemas on upsert.
      // ! we don't want to spam the ram whenever we upsert
      // * we want to keep the cache up to date
      const postfix = prepareCacheKey(REALM_PREFIX, realm, this.configFactory.app.realm.namespacePostfix);
      const { content } = gunzipSyncCacheObject(await this.cache.get<CacheObject>(postfix));
      let payload: Array<ContentUpsertReq>;
      const entity = await this.realmService.upsertRealm(realm, payload ?? contents);
      if (!Object.keys(content)?.length) return entity;
      const count = await this.realmService.countRealmContents();
      contents.forEach(({ id, value }) => content[id] && (content[id] = value));
      const cacheObj = gzipSyncCacheObject(content, this.configFactory.app.realm.gzipThreshold, count);
      await this.cache.set(postfix, cacheObj, this.configFactory.app.realm.ttl);
      return entity;
    });
    return await Promise.all(tasks);
  }

  @GetRealmContent()
  @OpenApi_GetRealmContent()
  async getRealmContent(@ParamRealm() realm: string, @ParamId() id: string) {
    const postfix = prepareCacheKey(REALM_PREFIX, realm, this.configFactory.app.realm.namespacePostfix);
    const cachedRealm = await this.cache.get<CacheObject>(postfix);
    const { content } = gunzipSyncCacheObject(cachedRealm);
    if (content[id]) {
      // @ we reset the ttl
      await this.cache.set(postfix, cachedRealm, this.configFactory.app.realm.ttl);
      return content[id];
    }
    const data = await this.realmService.getRealmContentByIds(realm, [id]);
    const count = await this.realmService.countRealmContents();
    if (!data[id]) throw new NotFoundException(`No such ID::${id} on REALM::${realm}`);
    const cacheObj = gzipSyncCacheObject({ ...content, ...data }, this.configFactory.app.realm.gzipThreshold, count);
    await this.cache.set(postfix, cacheObj, this.configFactory.app.realm.ttl);
    return data[id];
  }

  @DeleteRealm()
  @OpenApi_DeleteRealm()
  async deleteRealm(@ParamRealm() realm: string, @QueryIds() ids?: string[]) {
    const postfix = prepareCacheKey(REALM_PREFIX, realm, this.configFactory.app.realm.namespacePostfix);

    if (!ids) {
      await this.cache.del(postfix);
      return await this.realmService.deleteRealm(realm);
    }

    const filteredIds = Array.from(new Set(ids.filter((e) => e)));
    const { content } = gunzipSyncCacheObject(await this.cache.get<CacheObject>(postfix));
    const result = await this.realmService.deleteRealmContentByIds(realm, filteredIds);
    const count = await this.realmService.countRealmContents();

    if (count) {
      // @ we iterate through the ids and remove the id from the cache
      Object.keys(content).forEach((key) => (content[filteredIds.find((id) => id === key)] = undefined));
      const cacheObj = gzipSyncCacheObject(content, this.configFactory.app.realm.gzipThreshold, count);
      await this.cache.set(postfix, cacheObj, this.configFactory.app.realm.ttl);
    } else await this.cache.del(postfix);

    return result;
  }
}
