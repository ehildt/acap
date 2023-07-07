import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Controller,
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
import { RealmUpsertReq } from '@/dtos/realm-upsert-req.dto';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { CacheObject, gunzipSyncCacheObject } from '@/helpers/gunzip-sync-cache-object.helper';
import { gzipSyncCacheObject } from '@/helpers/gzip-sync-cache-object.helper';
import { prepareCacheKey } from '@/helpers/prepare-cache-key.helper';
import { reduceToConfigs } from '@/helpers/reduce-to-configs.helper';
import { ParseYmlInterceptor } from '@/interceptors/parse-yml.interceptor';
import { ConfigFactoryService } from '@/services/config-factory.service';
import { SchemaService } from '@/services/schema.service';

@ApiTags('Schemas')
@Controller('schemas')
export class JsonSchemaController {
  constructor(
    private readonly schemaService: SchemaService,
    private readonly configFactory: ConfigFactoryService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  @PostRealm()
  @OpenApi_SchemaUpsert()
  @UseInterceptors(ParseYmlInterceptor)
  async upsert(@ParamRealm() realm: string, @RealmUpsertBody() req: RealmUpsertReq[]) {
    return await this.schemaService.upsertRealm(realm, req);
  }

  @Post()
  @OpenApi_UpsertRealms()
  @UseInterceptors(ParseYmlInterceptor)
  async upsertRealms(@RealmUpsertRealmBody() req: RealmsUpsertReq[]) {
    return await this.schemaService.upsertRealms(req);
  }

  @GetSchema()
  @OpenApi_GetSchema()
  async getSchemaConfig(@ParamRealm() realm: string, @ParamId() id: string) {
    const postfix = prepareCacheKey('SCHEMA', realm, this.configFactory.config.namespacePostfix);
    const cache = gunzipSyncCacheObject(await this.cache.get<CacheObject>(postfix));
    const matchedKey = Object.keys(cache).find((key) => key === id);
    if (matchedKey) return cache[matchedKey];
    const data = await this.schemaService.getRealmConfigIds(realm, [id]);
    if (!Object.keys(data)?.length) throw new UnprocessableEntityException(`N/A realm: ${realm}`);
    const cacheData = gzipSyncCacheObject({ ...cache, ...data }, this.configFactory.config.gzipThreshold);
    await this.cache.set(postfix, cacheData, this.configFactory.config.ttl);
    if (data[id]) return data[id];
    throw new UnprocessableEntityException(`N/A realm: ${realm} | id: ${id}`);
  }

  @GetRealm()
  @OpenApi_GetRealm()
  async getRealm(@QueryRealm() realm: string, @QueryIds() ids?: string[]) {
    const postfix = prepareCacheKey('SCHEMA', realm, this.configFactory.config.namespacePostfix);
    let cache = gunzipSyncCacheObject(await this.cache.get<CacheObject>(postfix));

    if (!ids) {
      if (Object.keys(cache)?.length) return cache;
      const data = reduceToConfigs(this.configFactory.config.resolveEnv, await this.schemaService.getRealm(realm));
      if (!Object.keys(data)?.length) throw new UnprocessableEntityException(`N/A realm: ${realm}`);
      // ! if cache is empty, do we really want to fetch and populate it
      // yes because we fetch for a realm and thus need all configs on it
      // but we might want to keep track of how many configs are loaded
      // and in case not all are in ram, only then fetch for the whole realm
      const cacheData = gzipSyncCacheObject(data, this.configFactory.config.gzipThreshold);
      await this.cache.set(postfix, cacheData, this.configFactory.config.ttl);
      return data;
    }

    const filteredIds = Array.from(new Set(ids?.filter((e) => e)));
    const matchedKeys = Object.keys(cache).filter((c) => filteredIds.includes(c));
    if (matchedKeys?.length) cache = matchedKeys.reduce((acc, key) => ({ ...acc, [key]: cache[key] }), {});
    if (matchedKeys?.length === filteredIds?.length) return cache;
    // ! we have matchedKeys so only fetch those which did not match, not the whole filteredIds
    const entities = await this.schemaService.getRealmConfigIds(realm, filteredIds);
    cache = gzipSyncCacheObject({ ...cache, ...entities }, this.configFactory.config.gzipThreshold);
    await this.cache.set(postfix, cache, this.configFactory.config.ttl);
    return cache;
  }

  @Get()
  @OpenApi_GetRealms()
  async getRealms(@QueryRealms() realms?: string[], @QueryTake() take?: number, @QuerySkip() skip?: number) {
    if (!realms) return await this.schemaService.paginate(take ?? 100, skip ?? 0);
    return await this.schemaService.getRealms(realms);
  }

  @DeleteRealm()
  @OpenApi_DeleteRealm()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRealm(@ParamRealm() realm: string, @QueryIds() ids?: string[]) {
    const postfix = prepareCacheKey('SCHEMA', realm, this.configFactory.config.namespacePostfix);

    if (!ids) {
      await this.cache.del(postfix);
      return await this.schemaService.deleteRealm(realm);
    }

    const filteredIds = Array.from(new Set(ids.filter((e) => e)));
    const cache = (await this.cache.get(postfix)) ?? ({} as any);
    const keys = Object.keys(cache).filter((key) => delete cache[filteredIds.find((id) => id === key)]);
    await this.schemaService.deleteRealmConfigIds(realm, filteredIds);
    if (keys.length) await this.cache.set(postfix, cache, this.configFactory.config.ttl);
    else return await this.cache.del(postfix);
  }
}
