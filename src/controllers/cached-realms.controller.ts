import { MultipartFile } from '@fastify/multipart';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  StreamableFile,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';

import { JsonFile } from '@/decorators/class.property.values';
import {
  DeleteConfigIds,
  DeleteRealm,
  DownloadFile,
  GetConfigIds,
  GetPagination,
  GetRealm,
  PostFile,
  PostRealm,
} from '@/decorators/controller.method.decorators';
import {
  ConfigManagerUpsertBody,
  ConfigManagerUpsertRealmBody,
  ParamRealm,
  QueryConfigIds,
  QueryRealms,
} from '@/decorators/controller.parameter.decorators';
import { QuerySkip, QueryTake } from '@/decorators/controller.query.decorators';
import {
  OpenApi_DeleteRealm,
  OpenApi_DeleteRealmConfigIds,
  OpenApi_DownloadFile,
  OpenApi_GetPagination,
  OpenApi_GetRealm,
  OpenApi_GetRealmConfigIds,
  OpenApi_GetRealms,
  OpenApi_PostFile,
  OpenApi_Upsert,
  OpenApi_UpsertRealms,
} from '@/decorators/open-api.controller.decorators';
import { ConfigManagerUpsertRealmReq } from '@/dtos/config-manager-upsert-by-realm.dto.req';
import { ConfigManagerUpsertReq } from '@/dtos/config-manager-upsert-req.dto';
import { reduceToConfigs } from '@/helpers/reduce-to-configs.helper';
import { ConfigFactoryService } from '@/services/config-factory.service';
import { ManagerService } from '@/services/manager.service';

@ApiTags('CachedRealms')
@Controller('realms')
export class CachedRealmsController {
  constructor(
    private readonly configManagerService: ManagerService,
    private readonly configFactory: ConfigFactoryService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  @Post()
  @OpenApi_UpsertRealms()
  async upsertRealms(@ConfigManagerUpsertRealmBody() req: ConfigManagerUpsertRealmReq[]) {
    return await this.configManagerService.upsertRealms(req);
  }

  @GetPagination()
  @OpenApi_GetPagination()
  async paginate(@QueryTake() take: number, @QuerySkip() skip: number) {
    return await this.configManagerService.paginate(take, skip);
  }

  @PostFile()
  @OpenApi_PostFile()
  async uploadFile(@JsonFile() file: MultipartFile) {
    const content = JSON.parse((await file.toBuffer()).toString());
    return await this.configManagerService.upsertRealms(content);
  }

  @DownloadFile()
  @OpenApi_DownloadFile()
  async downloadConfigFile(@QueryRealms() realms?: string[]) {
    const file = await this.configManagerService.downloadConfigFile(realms);
    return new StreamableFile(Buffer.from(JSON.stringify(file, null, 4)));
  }

  @PostRealm()
  @OpenApi_Upsert()
  async upsert(@ParamRealm() realm: string, @ConfigManagerUpsertBody() req: ConfigManagerUpsertReq[]) {
    const postfix = `$${realm} @${this.configFactory.config.namespacePostfix}`;
    const entities = await this.configManagerService.upsertRealm(realm, req);
    const cache = (await this.cache.get(postfix)) ?? ({} as any);
    await this.cache.set(
      postfix,
      { ...cache, ...reduceToConfigs(this.configFactory.config.resolveEnv, req) },
      this.configFactory.config.ttl,
    );
    return entities;
  }

  @GetRealm()
  @OpenApi_GetRealm()
  async getRealm(@ParamRealm() realm: string) {
    const postfix = `$${realm} @${this.configFactory.config.namespacePostfix}`;
    const cache = (await this.cache.get(postfix)) ?? ({} as any);
    if (Object.keys(cache)?.length) return cache;
    const data = reduceToConfigs(this.configFactory.config.resolveEnv, await this.configManagerService.getRealm(realm));
    if (!Object.keys(data)?.length) throw new UnprocessableEntityException(`N/A realm: ${realm}`);
    await this.cache.set(postfix, data, this.configFactory.config.ttl);
    return data;
  }

  @Get()
  @OpenApi_GetRealms()
  async getRealms(@QueryRealms() realms: string[]) {
    return await this.configManagerService.getRealms(realms);
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
    const entities = await this.configManagerService.getRealmConfigIds(realm, ids);
    cache = { ...cache, ...entities };
    await this.cache.set(postfix, cache, this.configFactory.config.ttl);
    return cache;
  }

  @DeleteRealm()
  @OpenApi_DeleteRealm()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRealm(@ParamRealm() realm: string) {
    await this.cache.del(`${realm}_${this.configFactory.config.namespacePostfix}`);
    await this.configManagerService.deleteRealm(realm);
  }

  @DeleteConfigIds()
  @OpenApi_DeleteRealmConfigIds()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRealmConfigIds(@ParamRealm() realm: string, @QueryConfigIds() configIds: string[]) {
    const postfix = `$${realm} @${this.configFactory.config.namespacePostfix}`;
    const ids = Array.from(new Set(configIds.filter((e) => e)));
    const cache = (await this.cache.get(postfix)) ?? ({} as any);
    const keys = Object.keys(cache).filter((key) => delete cache[configIds.find((id) => id === key)]);
    await this.configManagerService.deleteRealmConfigIds(realm, ids);
    if (keys.length) await this.cache.set(postfix, cache, this.configFactory.config.ttl);
    else await this.cache.del(postfix);
  }
}
