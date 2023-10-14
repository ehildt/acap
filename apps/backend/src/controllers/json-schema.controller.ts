import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Inject, NotFoundException, Post, UnprocessableEntityException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';

import { SCHEMA_PREFIX } from '@/constants/app.constants';
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
  OpenApi_SchemaUpsert,
  OpenApi_UpsertSchemas,
} from '@/decorators/open-api.controller.decorators';
import { ContentUpsertReq } from '@/dtos/content-upsert-req.dto';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { CacheObject, gunzipSyncCacheObject } from '@/helpers/gunzip-sync-cache-object.helper';
import { gzipSyncCacheObject } from '@/helpers/gzip-sync-cache-object.helper';
import { prepareCacheKey } from '@/helpers/prepare-cache-key.helper';
import { reduceToContents } from '@/helpers/reduce-to-contents.helper';
import { AvjService } from '@/services/avj.service';
import { ConfigFactoryService } from '@/services/config-factory.service';
import { SchemaService } from '@/services/schema.service';

@ApiTags('Schemas')
@Controller('schemas')
export class JsonSchemaController {
  constructor(
    private readonly schemaService: SchemaService,
    private readonly configFactory: ConfigFactoryService,
    private readonly avjService: AvjService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  @PostRealm()
  @OpenApi_SchemaUpsert()
  async upsertSchema(@ParamRealm() realm: string, @RealmUpsertBody() req: Array<ContentUpsertReq>) {
    // @ schema validation start
    try {
      req.forEach(({ value }) => this.avjService.compile(value));
    } catch (error) {
      if (error.status === 400) throw new UnprocessableEntityException(error.message);
      if (error.message.startsWith('strict')) throw new UnprocessableEntityException(error.message);
      if (error.message === 'schema must be object or boolean') throw new UnprocessableEntityException(error.message);
    }
    // @ schema validation end
    // ! we don't cache schemas on upsert.
    // ! we don't want to spam the ram whenever we upsert
    // * we want to keep the cache up to date
    const entity = await this.schemaService.upsertRealm(realm, req);
    const postfix = prepareCacheKey(SCHEMA_PREFIX, realm, this.configFactory.app.realm.namespacePostfix);
    const { content } = gunzipSyncCacheObject(await this.cache.get<CacheObject>(postfix));
    if (!Object.keys(content)?.length) return entity;
    const count = await this.schemaService.countRealmContents();
    req.forEach(({ id, value }) => content[id] && (content[id] = value));
    const cacheObj = gzipSyncCacheObject(content, this.configFactory.app.realm.gzipThreshold, count);
    await this.cache.set(postfix, cacheObj, this.configFactory.app.realm.ttl);
    return entity;
  }

  @Post()
  @OpenApi_UpsertSchemas()
  async upsertSchemas(@RealmUpsertRealmBody() req: Array<RealmsUpsertReq>) {
    return await Promise.all(req.map(async ({ realm, contents }) => this.upsertSchema(realm, contents)));
  }

  @GetRealm()
  @OpenApi_GetRealm()
  async getRealm(@QueryRealm() realm: string, @QueryIds() ids?: string[]) {
    const postfix = prepareCacheKey(SCHEMA_PREFIX, realm, this.configFactory.app.realm.namespacePostfix);
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
      const data = reduceToContents(this.configFactory.app.realm.resolveEnv, await this.schemaService.getRealm(realm));
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
    const entities = await this.schemaService.getRealmContentByIds(realm, unmatchedKeys);
    const count = await this.schemaService.countRealmContents();
    content = { ...content, ...entities };
    const cacheObj = gzipSyncCacheObject(content, this.configFactory.app.realm.gzipThreshold, count);
    await this.cache.set(postfix, cacheObj, this.configFactory.app.realm.ttl);
    return content;
  }

  @GetRealmContent()
  @OpenApi_GetRealmContent()
  async getRealmContent(@ParamRealm() realm: string, @ParamId() id: string) {
    const postfix = prepareCacheKey(SCHEMA_PREFIX, realm, this.configFactory.app.realm.namespacePostfix);
    const cachedRealm = await this.cache.get<CacheObject>(postfix);
    const { content } = gunzipSyncCacheObject(cachedRealm);
    if (content[id]) {
      // @ we reset the ttl
      await this.cache.set(postfix, cachedRealm, this.configFactory.app.realm.ttl);
      return content[id];
    }
    const data = await this.schemaService.getRealmContentByIds(realm, [id]);
    const count = await this.schemaService.countRealmContents();
    if (!data[id]) throw new NotFoundException(`No such ID::${id} on REALM::${realm}`);
    const cacheObj = gzipSyncCacheObject({ ...content, ...data }, this.configFactory.app.realm.gzipThreshold, count);
    await this.cache.set(postfix, cacheObj, this.configFactory.app.realm.ttl);
    return data[id];
  }

  @DeleteRealm()
  @OpenApi_DeleteRealm()
  async deleteRealm(@ParamRealm() realm: string, @QueryIds() ids?: string[]) {
    const postfix = prepareCacheKey(SCHEMA_PREFIX, realm, this.configFactory.app.realm.namespacePostfix);

    if (!ids) {
      await this.cache.del(postfix);
      return await this.schemaService.deleteRealm(realm);
    }

    const filteredIds = Array.from(new Set(ids.filter((e) => e)));
    const { content } = gunzipSyncCacheObject(await this.cache.get<CacheObject>(postfix));
    const result = await this.schemaService.deleteRealmContentByIds(realm, filteredIds);
    const count = await this.schemaService.countRealmContents();

    if (count) {
      // @ we iterate through the ids and remove the id from the cache
      Object.keys(content).forEach((key) => (content[filteredIds.find((id) => id === key)] = undefined));
      const cacheObj = gzipSyncCacheObject(content, this.configFactory.app.realm.gzipThreshold, count);
      await this.cache.set(postfix, cacheObj, this.configFactory.app.realm.ttl);
    } else await this.cache.del(postfix);

    return result;
  }
}
