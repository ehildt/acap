import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Post,
  UnprocessableEntityException,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';

import { DeleteRealm, GetRealm, GetSchema, PostRealm } from '@/decorators/controller.method.decorators';
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
  OpenApi_GetRealms,
  OpenApi_GetSchema,
  OpenApi_SchemaUpsert,
  OpenApi_UpsertRealms,
} from '@/decorators/open-api.controller.decorators';
import { ContentUpsertReq } from '@/dtos/content-upsert-req.dto';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { CacheObject, gunzipSyncCacheObject } from '@/helpers/gunzip-sync-cache-object.helper';
import { gzipSyncCacheObject } from '@/helpers/gzip-sync-cache-object.helper';
import { prepareCacheKey } from '@/helpers/prepare-cache-key.helper';
import { reduceToConfigs } from '@/helpers/reduce-to-configs.helper';
import { ParseYmlInterceptor } from '@/interceptors/parse-yml.interceptor';
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
  @UseInterceptors(ParseYmlInterceptor)
  async upsertRealm(@ParamRealm() realm: string, @RealmUpsertBody() req: Array<ContentUpsertReq>) {
    // @ schema validation start
    try {
      req.forEach(({ value }) => this.avjService.compile(value));
    } catch (error) {
      // * avj strict mode - must abide by the schema definition rules
      if ((error.message as string).startsWith('strict')) throw new BadRequestException(error.message);
      // * 400 - some avj schema validation error on compiling
      if (error.status === 400) throw error.message;
    }
    // @ schema validation end
    // ! we don't cache schemas on upsert.
    // ! we don't want to spam the ram whenever we upsert
    // * we want to keep the cache up to date
    const entity = await this.schemaService.upsertRealm(realm, req);
    const postfix = prepareCacheKey('SCHEMA', realm, this.configFactory.app.realm.namespacePostfix);
    const { content } = gunzipSyncCacheObject(await this.cache.get<CacheObject>(postfix));
    if (!Object.keys(content)?.length) return entity;
    const count = await this.schemaService.countRealmContents();
    req.forEach(({ id, value }) => content[id] && (content[id] = value));
    const cacheObj = gzipSyncCacheObject(content, this.configFactory.app.realm.gzipThreshold, count);
    await this.cache.set(postfix, cacheObj, this.configFactory.app.realm.ttl);
    return entity;
  }

  @Post()
  @OpenApi_UpsertRealms()
  @UseInterceptors(ParseYmlInterceptor)
  async upsertRealms(@RealmUpsertRealmBody() req: Array<RealmsUpsertReq>) {
    const tasks = req.map(async ({ realm, contents }) => {
      // @ schema validation start
      try {
        contents.forEach(({ value }) => this.avjService.compile(value));
      } catch (error) {
        // * 400 - error is coming from avj
        // * 422 - error is coming from schemaService
        if (error.status === 400) throw new BadRequestException(error);
      }
      // @ schema validation end
      // ! we don't cache schemas on upsert.
      // ! we don't want to spam the ram whenever we upsert
      // * we want to keep the cache up to date
      const entity = await this.schemaService.upsertRealm(realm, contents);
      const postfix = prepareCacheKey('SCHEMA', realm, this.configFactory.app.realm.namespacePostfix);
      const { content } = gunzipSyncCacheObject(await this.cache.get<CacheObject>(postfix));
      if (!Object.keys(content)?.length) return entity;
      const count = await this.schemaService.countRealmContents();
      contents.forEach(({ id, value }) => content[id] && (content[id] = value));
      const cacheObj = gzipSyncCacheObject(content, this.configFactory.app.realm.gzipThreshold, count);
      await this.cache.set(postfix, cacheObj, this.configFactory.app.realm.ttl);
      return entity;
    });
    return await Promise.all(tasks);
  }

  @GetSchema()
  @OpenApi_GetSchema()
  async getSchemaConfig(@ParamRealm() realm: string, @ParamId() id: string) {
    const postfix = prepareCacheKey('SCHEMA', realm, this.configFactory.app.realm.namespacePostfix);
    const { content } = gunzipSyncCacheObject(await this.cache.get<CacheObject>(postfix));
    if (content[id]) return content[id];
    const data = await this.schemaService.getRealmConfigIds(realm, [id]);
    const count = await this.schemaService.countRealmContents();
    if (!Object.keys(data)?.length) throw new UnprocessableEntityException(`N/A realm: ${realm}`);
    const cacheObj = gzipSyncCacheObject({ ...content, ...data }, this.configFactory.app.realm.gzipThreshold, count);
    await this.cache.set(postfix, cacheObj, this.configFactory.app.realm.ttl);
    if (data[id]) return data[id];
    throw new UnprocessableEntityException(`N/A realm: ${realm} | id: ${id}`);
  }

  @GetRealm()
  @OpenApi_GetRealm()
  async getRealm(@QueryRealm() realm: string, @QueryIds() ids?: string[]) {
    const postfix = prepareCacheKey('SCHEMA', realm, this.configFactory.app.realm.namespacePostfix);
    const cache = gunzipSyncCacheObject(await this.cache.get<CacheObject>(postfix));

    if (!ids) {
      if (Object.keys(cache.content)?.length) return cache.content;
      const data = reduceToConfigs(this.configFactory.app.realm.resolveEnv, await this.schemaService.getRealm(realm));
      if (!Object.keys(data)?.length) throw new UnprocessableEntityException(`N/A realm: ${realm}`);
      const cacheObj = gzipSyncCacheObject(data, this.configFactory.app.realm.gzipThreshold, Object.keys(data).length);
      await this.cache.set(postfix, cacheObj, this.configFactory.app.realm.ttl);
      return data;
    }

    const filteredIds = Array.from(new Set(ids?.filter((e) => e)));
    const matchedKeys = Object.keys(cache.content).filter((c) => filteredIds.includes(c));
    if (matchedKeys?.length)
      cache.content = matchedKeys.reduce((acc, key) => ({ ...acc, [key]: cache.content[key] }), {});
    if (matchedKeys?.length === filteredIds?.length) return cache.content;
    const unmatchedKeys = filteredIds.filter((fk) => !matchedKeys.find((mk) => fk === mk));
    const entities = await this.schemaService.getRealmConfigIds(realm, unmatchedKeys);
    const count = await this.schemaService.countRealmContents();
    const content = { ...cache.content, ...entities };
    const cacheObj = gzipSyncCacheObject(content, this.configFactory.app.realm.gzipThreshold, count);
    await this.cache.set(postfix, cacheObj, this.configFactory.app.realm.ttl);
    return content;
  }

  @Get()
  @OpenApi_GetRealms()
  async getRealms(@QueryRealms() realms?: string[], @QueryTake() take?: number, @QuerySkip() skip?: number) {
    if (!realms) return await this.schemaService.paginate(take ?? 100, skip ?? 0);
    return await this.schemaService.getRealms(realms);
  }

  @DeleteRealm()
  @OpenApi_DeleteRealm()
  async deleteRealm(@ParamRealm() realm: string, @QueryIds() ids?: string[]) {
    const postfix = prepareCacheKey('SCHEMA', realm, this.configFactory.app.realm.namespacePostfix);

    if (!ids) {
      await this.cache.del(postfix);
      return await this.schemaService.deleteRealm(realm);
    }

    const filteredIds = Array.from(new Set(ids.filter((e) => e)));
    const { content } = gunzipSyncCacheObject(await this.cache.get<CacheObject>(postfix));
    const result = await this.schemaService.deleteRealmConfigIds(realm, filteredIds);
    const count = await this.schemaService.countRealmContents();

    if (count) {
      Object.keys(content).forEach((key) => (content[filteredIds.find((id) => id === key)] = undefined));
      const cacheObj = gzipSyncCacheObject(content, this.configFactory.app.realm.gzipThreshold, count);
      await this.cache.set(postfix, cacheObj, this.configFactory.app.realm.ttl);
    } else await this.cache.del(postfix);

    return result;
  }
}
