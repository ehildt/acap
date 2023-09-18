import { Injectable } from '@nestjs/common';

import { challengeContentValue } from '@/helpers/challenge-content-source.helper';
import { challengeParseContentValue } from '@/helpers/challenge-parse-content-value.helper';
import { FILTER } from '@/models/filter.model';
import { RealmRepository } from '@/repositories/realm.repository';
import { SchemaRepository } from '@/repositories/schema.repository';

import { ConfigFactoryService } from './config-factory.service';
import { CryptoService } from './crypto.service';

const QUERY_PROPERTIES = ['realm', 'id', 'createdAt', 'updatedAt', '-_id'];

@Injectable()
export class MetaService {
  constructor(
    private readonly realmRepository: RealmRepository,
    private readonly schemaRepository: SchemaRepository,
    private readonly configFactory: ConfigFactoryService,
    private readonly cryptoService: CryptoService,
  ) {}

  async getRealmMeta(filter: FILTER) {
    const realms = {};
    const schemas = {};
    const realmConfigEntities = await this.realmRepository.find(filter, QUERY_PROPERTIES);
    const realmSchemas = realmConfigEntities.map(({ realm }) => realm);
    const schemaConfigEntities = await this.schemaRepository.getMetaSchemasByRealms(realmSchemas, QUERY_PROPERTIES);
    this.#mapRealmEntitiesMeta(schemaConfigEntities, schemas);
    this.#mapRealmEntitiesMeta(realmConfigEntities, realms, schemas);
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
    this.#mapSchemaEntitiesMeta(realmConfigEntities, realms);
    this.#mapSchemaEntitiesMeta(schemaConfigEntities, schemas, realms);
    const count = await this.schemaRepository.countSchemas();
    return {
      count,
      data: schemas,
    };
  }

  #mapRealmEntitiesMeta(entities: Array<any>, collection: Record<any, any>, schemaCollection?: Record<any, any>) {
    entities.forEach(({ realm, value, ...rest }) => {
      const realmConfigs = collection[realm];
      const schemaConfigs = schemaCollection?.[realm];
      let hasSchema = false;
      const payload = this.configFactory.app.crypto.cryptable && value ? this.cryptoService.decrypt(value) : value;
      const challengedPayload = challengeContentValue(payload, this.configFactory.app.realm.resolveEnv);
      if (schemaConfigs) hasSchema = Boolean(schemaConfigs.find(({ id }) => rest.id === id));
      if (!Array.isArray(realmConfigs))
        collection[realm] = schemaCollection
          ? [{ ...rest, hasSchema, value: challengedPayload }]
          : [{ ...rest, value: challengedPayload }];
      else
        realmConfigs.push(
          schemaCollection ? { ...rest, hasSchema, value: challengedPayload } : { ...rest, value: challengedPayload },
        );
    });
  }

  #mapSchemaEntitiesMeta(entities: Array<any>, collection: Record<any, any>, schemaCollection?: Record<any, any>) {
    entities.forEach(({ realm, value, ...rest }) => {
      const challengedValue = challengeParseContentValue(value);
      const realmConfigs = collection[realm];
      const schemaConfigs = schemaCollection?.[realm];
      let hasRealm = false;
      if (schemaConfigs) hasRealm = Boolean(schemaConfigs.find(({ id }) => rest.id === id));
      if (!Array.isArray(realmConfigs))
        collection[realm] = schemaCollection
          ? [{ ...rest, hasRealm, value: challengedValue }]
          : [{ ...rest, value: challengedValue }];
      else
        realmConfigs.push(
          schemaCollection ? { ...rest, hasRealm, value: challengedValue } : { ...rest, value: challengedValue },
        );
    });
  }
}
