import { Injectable } from '@nestjs/common';

import { FILTER } from '@/models/filter.model';
import { RealmRepository } from '@/repositories/realm.repository';
import { SchemaRepository } from '@/repositories/schema.repository';

@Injectable()
export class MetaService {
  constructor(
    private readonly realmRepository: RealmRepository,
    private readonly schemaRepository: SchemaRepository,
  ) {}

  async getRealmMeta(filter: FILTER) {
    const realms = {};
    const schemas = {};
    const realmConfigEntities = await this.realmRepository.find(filter, QUERY_PROPERTIES);
    const realmSchemas = realmConfigEntities.map(({ realm }) => realm);
    const schemaConfigEntities = await this.schemaRepository.getMetaSchemasByRealms(realmSchemas, QUERY_PROPERTIES);
    mapRealmEntitiesMeta(schemaConfigEntities, schemas);
    mapRealmEntitiesMeta(realmConfigEntities, realms, schemas);
    const count = await this.realmRepository.countRealms();
    return {
      count,
      data: realms,
    };
  }

  async getSchemaMeta(filter: FILTER) {
    const realms = {};
    const schemas = {};
    const schemaConfigEntities = await this.schemaRepository.find(filter, QUERY_PROPERTIES);
    const realmSchemas = schemaConfigEntities.map(({ realm }) => realm);
    const realmConfigEntities = await this.realmRepository.getMetaRealmsBySchemas(realmSchemas, QUERY_PROPERTIES);
    mapSchemaEntitiesMeta(realmConfigEntities, realms);
    mapSchemaEntitiesMeta(schemaConfigEntities, schemas, realms);
    const count = await this.schemaRepository.countSchemas();
    return {
      count,
      data: schemas,
    };
  }
}

const QUERY_PROPERTIES = ['realm', 'id', 'createdAt', 'updatedAt', '-_id'];

function mapRealmEntitiesMeta(entities: Array<any>, collection: Record<any, any>, schemaCollection?: Record<any, any>) {
  entities.forEach(({ realm, ...rest }) => {
    const realmConfigs = collection[realm];
    const schemaConfigs = schemaCollection?.[realm];
    let hasSchema = false;
    if (schemaConfigs) hasSchema = Boolean(schemaConfigs.find(({ id }) => rest.id === id));
    if (!Array.isArray(realmConfigs)) collection[realm] = schemaCollection ? [{ ...rest, hasSchema }] : [rest];
    else realmConfigs.push(schemaCollection ? { ...rest, hasSchema } : rest);
  });
}

function mapSchemaEntitiesMeta(
  entities: Array<any>,
  collection: Record<any, any>,
  schemaCollection?: Record<any, any>,
) {
  entities.forEach(({ realm, ...rest }) => {
    const realmConfigs = collection[realm];
    const schemaConfigs = schemaCollection?.[realm];
    let hasRealm = false;
    if (schemaConfigs) hasRealm = Boolean(schemaConfigs.find(({ id }) => rest.id === id));
    if (!Array.isArray(realmConfigs)) collection[realm] = schemaCollection ? [{ ...rest, hasRealm }] : [rest];
    else realmConfigs.push(schemaCollection ? { ...rest, hasRealm } : rest);
  });
}
