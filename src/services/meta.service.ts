import { Injectable } from '@nestjs/common';

import { RealmRepository } from '@/repositories/realm.repository';
import { SchemaRepository } from '@/repositories/schema.repository';

@Injectable()
export class MetaService {
  constructor(private readonly realmRepository: RealmRepository, private readonly schemaRepository: SchemaRepository) {}

  async getRealmMeta(take: number, skip: number) {
    const realms = {};
    const schemas = {};
    // ! fetch for realms first, then the configs by realm!
    const realmConfigEntities = await this.realmRepository.getMeta(take, skip, QUERY_PROPERTIES);
    const realmSchemas = realmConfigEntities.map(({ realm }) => realm);
    const schemaConfigEntities = await this.schemaRepository.getMetaSchemasByRealms(realmSchemas, QUERY_PROPERTIES);
    mapRealmEntitiesMeta(schemaConfigEntities, schemas);
    mapRealmEntitiesMeta(realmConfigEntities, realms, schemas);
    return realms;
  }

  async getSchemaMeta(take: number, skip: number) {
    const realms = {};
    const schemas = {};
    // ! fetch for schemas first, then the configs by schema!
    const schemaConfigEntities = await this.schemaRepository.getMeta(take, skip, QUERY_PROPERTIES);
    const realmSchemas = schemaConfigEntities.map(({ realm }) => realm);
    const realmConfigEntities = await this.realmRepository.getMetaRealmsBySchemas(realmSchemas, QUERY_PROPERTIES);
    mapSchemaEntitiesMeta(realmConfigEntities, realms);
    mapSchemaEntitiesMeta(schemaConfigEntities, schemas, realms);
    return schemas;
  }
}

const QUERY_PROPERTIES = ['realm', 'id', 'createdAt', 'updatedAt', '-_id'];

function mapRealmEntitiesMeta(entities: any[], collection: Record<any, any>, schemaCollection?: Record<any, any>) {
  entities.forEach(({ realm, ...rest }) => {
    const realmConfigs = collection[realm];
    const schemaConfigs = schemaCollection?.[realm];
    let hasSchema = false;
    if (schemaConfigs) hasSchema = Boolean(schemaConfigs.find(({ id }) => rest.id === id));
    if (!Array.isArray(realmConfigs)) collection[realm] = schemaCollection ? [{ ...rest, hasSchema }] : [rest];
    else realmConfigs.push(schemaCollection ? { ...rest, hasSchema } : rest);
  });
}

function mapSchemaEntitiesMeta(entities: any[], collection: Record<any, any>, schemaCollection?: Record<any, any>) {
  entities.forEach(({ realm, ...rest }) => {
    const realmConfigs = collection[realm];
    const schemaConfigs = schemaCollection?.[realm];
    let hasRealm = false;
    if (schemaConfigs) hasRealm = Boolean(schemaConfigs.find(({ id }) => rest.id === id));
    if (!Array.isArray(realmConfigs)) collection[realm] = schemaCollection ? [{ ...rest, hasRealm }] : [rest];
    else realmConfigs.push(schemaCollection ? { ...rest, hasRealm } : rest);
  });
}
