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
import { reduceToConfigs } from '@/helpers/reduce-to-configs.helper';
import { ParseYmlInterceptor } from '@/interceptors/parse-yml.interceptor';
import { ConfigFactoryService } from '@/services/config-factory.service';
import { RealmsService } from '@/services/realms.service';

@ApiTags('Configs')
@Controller('configs')
export class RealmController {
  constructor(
    private readonly realmsService: RealmsService,
    private readonly configFactory: ConfigFactoryService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  @GetRealmConfig()
  @OpenApi_GetRealmConfig()
  async getRealmConfig(@ParamRealm() realm: string, @ParamId() id: string) {
    const postfix = `$REALM:${realm} @${this.configFactory.config.namespacePostfix}`;
    const cache = (await this.cache.get(postfix)) ?? ({} as any);
    const matchedKey = Object.keys(cache).find((key) => key === id);
    if (matchedKey) return cache[matchedKey];
    const data = reduceToConfigs(this.configFactory.config.resolveEnv, await this.realmsService.getRealm(realm));
    if (!Object.keys(data)?.length) throw new UnprocessableEntityException(`N/A realm: ${realm}`);
    await this.cache.set(postfix, data, this.configFactory.config.ttl);
    const value = data[id];
    if (value) return value;
    throw new UnprocessableEntityException(`N/A realm: ${realm} | id: ${id}`);
  }

  @GetRealm()
  @OpenApi_GetRealm()
  async getRealm(@QueryRealm() realm: string, @QueryIds() ids?: string[]) {
    const postfix = `$REALM:${realm} @${this.configFactory.config.namespacePostfix}`;
    let cache = (await this.cache.get(postfix)) ?? ({} as any);

    if (!ids) {
      if (Object.keys(cache)?.length) return cache;
      const data = reduceToConfigs(this.configFactory.config.resolveEnv, await this.realmsService.getRealm(realm));
      if (!Object.keys(data)?.length) throw new UnprocessableEntityException(`N/A realm: ${realm}`);
      await this.cache.set(postfix, data, this.configFactory.config.ttl);
      return data;
    }

    const filteredIds = Array.from(new Set(ids?.filter((e) => e)));
    const matchedKeys = Object.keys(cache).filter((c) => filteredIds.includes(c));
    if (matchedKeys?.length) cache = matchedKeys.reduce((acc, key) => ({ ...acc, [key]: cache[key] }), {});
    if (matchedKeys?.length === filteredIds?.length) return cache;
    const entities = await this.realmsService.getRealmConfigIds(realm, filteredIds);
    cache = { ...cache, ...entities };
    await this.cache.set(postfix, cache, this.configFactory.config.ttl);
    return cache;
  }

  @DeleteRealm()
  @OpenApi_DeleteRealm()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRealm(@ParamRealm() realm: string, @QueryIds() ids?: string[]) {
    const postfix = `$REALM:${realm} @${this.configFactory.config.namespacePostfix}`;

    if (!ids) {
      await this.cache.del(postfix);
      return await this.realmsService.deleteRealm(realm);
    }

    const filteredIds = Array.from(new Set(ids.filter((e) => e)));
    const cache = (await this.cache.get(postfix)) ?? ({} as any);
    const keys = Object.keys(cache).filter((key) => delete cache[filteredIds.find((id) => id === key)]);
    await this.realmsService.deleteRealmConfigIds(realm, filteredIds);
    if (keys.length) await this.cache.set(postfix, cache, this.configFactory.config.ttl);
    else return await this.cache.del(postfix);
  }

  @PostRealm()
  @OpenApi_Upsert()
  @UseInterceptors(ParseYmlInterceptor)
  async upsert(@ParamRealm() realm: string, @RealmUpsertBody() req: RealmUpsertReq[]) {
    return await this.realmsService.upsertRealm(realm, req);
  }

  @Post()
  @OpenApi_UpsertRealms()
  @UseInterceptors(ParseYmlInterceptor)
  async upsertRealms(@RealmUpsertRealmBody() req: RealmsUpsertReq[]) {
    return await this.realmsService.upsertRealms(req);
  }

  @Get()
  @OpenApi_GetRealms()
  async getRealms(@QueryRealms() realms?: string[], @QueryTake() take?: number, @QuerySkip() skip?: number) {
    if (!realms) return await this.realmsService.paginate(take ?? 100, skip ?? 0);
    return await this.realmsService.getRealms(realms);
  }
}
