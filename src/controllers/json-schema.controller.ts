import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Inject, Post, UnprocessableEntityException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';

import { GetSchema, PostRealm } from '@/decorators/controller.method.decorators';
import {
  ParamRealm,
  QueryConfigId,
  QueryRealm,
  RealmUpsertBody,
  RealmUpsertRealmBody,
} from '@/decorators/controller.parameter.decorators';
import {
  OpenApi_GetSchema,
  OpenApi_SchemaUpsert,
  OpenApi_UpsertRealms,
} from '@/decorators/open-api.controller.decorators';
import { RealmUpsertReq } from '@/dtos/realm-upsert-req.dto';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { reduceToConfigs } from '@/helpers/reduce-to-configs.helper';
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
  async upsert(@ParamRealm() realm: string, @RealmUpsertBody() req: RealmUpsertReq[]) {
    return await this.schemaService.upsertRealm(realm, req);
  }

  @Post()
  @OpenApi_UpsertRealms()
  async upsertRealms(@RealmUpsertRealmBody() req: RealmsUpsertReq[]) {
    return await this.schemaService.upsertRealms(req);
  }

  @GetSchema()
  @OpenApi_GetSchema()
  async getRealm(@QueryRealm() schema: string, @QueryConfigId() id: string) {
    const postfix = `$SCHEMA:${schema}_${id} @${this.configFactory.config.namespacePostfix}`;
    const cache = (await this.cache.get(postfix)) ?? ({} as any);
    const matchedKey = Object.keys(cache).find((key) => key === id);
    if (matchedKey) return cache[matchedKey];
    const data = reduceToConfigs(this.configFactory.config.resolveEnv, await this.schemaService.getRealm(schema));
    if (!Object.keys(data)?.length) throw new UnprocessableEntityException(`N/A schema: ${schema}`);
    await this.cache.set(postfix, data, this.configFactory.config.ttl);
    const value = data[id];
    if (value) return value;
    throw new UnprocessableEntityException(`N/A schema: ${schema} | id: ${id}`);
  }
}
