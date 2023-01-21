import { MultipartFile } from '@fastify/multipart';
import {
  CACHE_MANAGER,
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

import { ConfigFactoryService } from './configs/config-factory.service';
import { JsonFile } from './decorators/class.property.values';
import {
  DeleteConfigIds,
  DeleteNamespace,
  DownloadFile,
  GetConfigIds,
  GetNamespace,
  GetPagination,
  PostFile,
  PostNamespace,
  PostPassThroughPubSub,
} from './decorators/controller.method.decorators';
import {
  ConfigManagerUpsertBody,
  ConfigManagerUpsertNamespaceBody,
  ParamNamespace,
  QueryConfigIds,
  QueryNamespaces,
} from './decorators/controller.parameter.decorators';
import { QuerySkip, QueryTake } from './decorators/controller.query.decorators';
import {
  OpenApi_DeleteNamespace,
  OpenApi_DeleteNamespaceConfigIds,
  OpenApi_DownloadFile,
  OpenApi_GetNamespace,
  OpenApi_GetNamespaceConfigIds,
  OpenApi_GetNamespaces,
  OpenApi_GetPagination,
  OpenApi_PassThrough,
  OpenApi_PostFile,
  OpenApi_Upsert,
  OpenApi_UpsertNamespaces,
} from './decorators/open-api.controller.decorators';
import { ConfigManagerUpsertNamespaceReq } from './dtos/config-manager-upsert-by-namespace.dto.req';
import { ConfigManagerUpsertReq } from './dtos/config-manager-upsert-req.dto';
import { ConfigManagerService } from './services/config-manager.service';
import { reduceToConfigs } from './services/helpers/reduce-to-configs.helper';

@ApiTags('Config-Manager')
@Controller('namespaces')
export class ConfigManagerController {
  constructor(
    private readonly configManagerService: ConfigManagerService,
    private readonly configFactory: ConfigFactoryService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  @PostPassThroughPubSub()
  @OpenApi_PassThrough()
  async upsertPassThroughCaching(@ConfigManagerUpsertNamespaceBody() req: ConfigManagerUpsertNamespaceReq[]) {
    return await this.configManagerService.passThrough(req);
  }

  @Post()
  @OpenApi_UpsertNamespaces()
  async upsertNamespaces(@ConfigManagerUpsertNamespaceBody() req: ConfigManagerUpsertNamespaceReq[]) {
    return await this.configManagerService.upsertNamespaces(req);
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
    return await this.configManagerService.upsertNamespaces(content);
  }

  @DownloadFile()
  @OpenApi_DownloadFile()
  async downloadConfigFile(@QueryNamespaces() namespaces?: string[]) {
    const file = await this.configManagerService.downloadConfigFile(namespaces);
    return new StreamableFile(Buffer.from(JSON.stringify(file, null, 4)));
  }

  @PostNamespace()
  @OpenApi_Upsert()
  async upsert(@ParamNamespace() namespace: string, @ConfigManagerUpsertBody() req: ConfigManagerUpsertReq[]) {
    const postfix = `$${namespace} @${this.configFactory.config.namespacePostfix}`;
    const entities = await this.configManagerService.upsertNamespace(namespace, req);
    const cache = (await this.cache.get(postfix)) ?? ({} as any);
    await this.cache.set(
      postfix,
      { ...cache, ...reduceToConfigs(this.configFactory.config.resolveEnv, req) },
      this.configFactory.config.ttl,
    );
    return entities;
  }

  @GetNamespace()
  @OpenApi_GetNamespace()
  async getNamespace(@ParamNamespace() namespace: string) {
    const postfix = `$${namespace} @${this.configFactory.config.namespacePostfix}`;
    const cache = (await this.cache.get(postfix)) ?? ({} as any);
    if (Object.keys(cache)?.length) return cache;
    const data = reduceToConfigs(
      this.configFactory.config.resolveEnv,
      await this.configManagerService.getNamespace(namespace),
    );
    if (!Object.keys(data)?.length) throw new UnprocessableEntityException(`N/A namespace: ${namespace}`);
    await this.cache.set(postfix, data, this.configFactory.config.ttl);
    return data;
  }

  @Get()
  @OpenApi_GetNamespaces()
  async getNamespaces(@QueryNamespaces() namespaces: string[]) {
    return await this.configManagerService.getNamespaces(namespaces);
  }

  @GetConfigIds()
  @OpenApi_GetNamespaceConfigIds()
  async getNamespaceConfigIds(@ParamNamespace() namespace: string, @QueryConfigIds() configIds: string[]) {
    const postfix = `$${namespace} @${this.configFactory.config.namespacePostfix}`;
    const ids = Array.from(new Set(configIds.filter((e) => e)));
    let cache = (await this.cache.get(postfix)) ?? ({} as any);
    const matchedKeys = Object.keys(cache).filter((c) => ids.includes(c));
    if (matchedKeys?.length) cache = matchedKeys.reduce((acc, key) => ({ ...acc, [key]: cache[key] }), {});
    if (matchedKeys?.length === ids?.length) return cache;
    const entities = await this.configManagerService.getNamespaceConfigIds(namespace, ids);
    cache = { ...cache, ...entities };
    await this.cache.set(postfix, cache, this.configFactory.config.ttl);
    return cache;
  }

  @DeleteNamespace()
  @OpenApi_DeleteNamespace()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNamespace(@ParamNamespace() namespace: string) {
    await this.cache.del(`${namespace}_${this.configFactory.config.namespacePostfix}`);
    await this.configManagerService.deleteNamespace(namespace);
  }

  @DeleteConfigIds()
  @OpenApi_DeleteNamespaceConfigIds()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNamespaceConfigIds(@ParamNamespace() namespace: string, @QueryConfigIds() configIds: string[]) {
    const postfix = `$${namespace} @${this.configFactory.config.namespacePostfix}`;
    const ids = Array.from(new Set(configIds.filter((e) => e)));
    const cache = (await this.cache.get(postfix)) ?? ({} as any);
    const keys = Object.keys(cache).filter((key) => delete cache[configIds.find((id) => id === key)]);
    await this.configManagerService.deleteNamespaceConfigIds(namespace, ids);
    if (keys.length) await this.cache.set(postfix, cache, this.configFactory.config.ttl);
    else await this.cache.del(postfix);
  }
}
