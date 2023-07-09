import { Injectable } from '@nestjs/common';

import { RealmRepository } from '@/repositories/realm.repository';
import { SchemaRepository } from '@/repositories/schema.repository';

const QUERY_PROPERTIES = ['realm', 'id', 'createdAt', 'updatedAt', '-_id'];

function mapEntitiesMeta(entities: any[], collection: Record<any, any>, schemaCollection?: Record<any, any>) {
  entities.forEach(({ realm, ...rest }) => {
    const realmConfigs = collection[realm];
    const schemaConfigs = schemaCollection?.[realm];
    let hasSchema = false;
    if (schemaConfigs) hasSchema = Boolean(schemaConfigs.find(({ id }) => rest.id === id));
    if (!Array.isArray(realmConfigs)) collection[realm] = schemaCollection ? [{ ...rest, hasSchema }] : [rest];
    else realmConfigs.push(schemaCollection ? { ...rest, hasSchema } : rest);
  });
}

@Injectable()
export class MetaService {
  constructor(private readonly realmRepository: RealmRepository, private readonly schemaRepository: SchemaRepository) {}

  async getMeta(take: number, skip: number) {
    const realms = {};
    const schemas = {};
    const realmConfigEntities = await this.realmRepository.getMeta(take, skip, QUERY_PROPERTIES);
    const schemaConfigEntities = await this.schemaRepository.getMeta(take, skip, QUERY_PROPERTIES);
    mapEntitiesMeta(schemaConfigEntities, schemas);
    mapEntitiesMeta(realmConfigEntities, realms, schemas);
    return { realms, schemas };
  }
}
