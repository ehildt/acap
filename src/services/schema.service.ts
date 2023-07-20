import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, Optional, UnprocessableEntityException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Queue } from 'bullmq';
import { catchError } from 'rxjs';

import {
  BULLMQ_DELETE_SCHEMA,
  BULLMQ_DELETE_SCHEMA_CONFIGS,
  BULLMQ_SCHEMAS_QUEUE,
  BULLMQ_UPSERT_SCHEMA,
  REDIS_PUBSUB,
} from '@/constants/app.constants';
import { RealmUpsertReq } from '@/dtos/realm-upsert-req.dto';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { mapEntitiesToConfigFile } from '@/helpers/map-entities-to-config-file.helper';
import { reduceEntities } from '@/helpers/reduce-entities.helper';
import { reduceToRealms } from '@/helpers/reduce-to-realms.helper';
import { SchemaRepository } from '@/repositories/schema.repository';

import { ConfigFactoryService } from './config-factory.service';

@Injectable()
export class SchemaService {
  constructor(
    private readonly schemaRepository: SchemaRepository,
    private readonly factory: ConfigFactoryService,
    @Optional() @Inject(REDIS_PUBSUB) private readonly redisPubSubClient: ClientProxy,
    @Optional() @InjectQueue(BULLMQ_SCHEMAS_QUEUE) private readonly bullmq: Queue,
  ) {}

  async upsertRealm(realm: string, req: RealmUpsertReq[]) {
    const result = await this.schemaRepository.upsert(realm, req);
    if (!result?.ok) return result;
    this.redisPubSubClient?.emit(realm, req).pipe(catchError((error) => error));
    this.bullmq?.add(BULLMQ_UPSERT_SCHEMA, { realm, configs: req }).catch((error) => error);
    return result;
  }

  async upsertRealms(reqs: RealmsUpsertReq[]) {
    const result = await this.schemaRepository.upsertMany(reqs);
    if (!result?.ok) return result;
    if (this.redisPubSubClient)
      reqs.map(({ realm, configs }) => this.redisPubSubClient.emit(realm, configs).pipe((error) => error));
    this.bullmq?.addBulk(reqs.map((data) => ({ name: BULLMQ_UPSERT_SCHEMA, data }))).catch((error) => error);
    return result;
  }

  async getRealms(realms: string[]) {
    const realmSet = Array.from(new Set(realms.map((space) => space.trim())));
    const entities = await this.schemaRepository.where({ realm: { $in: realmSet } });
    return entities?.reduce((acc, val) => reduceToRealms(acc, val, this.factory.config.resolveEnv), {});
  }

  async getRealm(realm: string) {
    return await this.schemaRepository.where({ realm });
  }

  async getRealmConfigIds(realm: string, ids: string[]) {
    const entities = await this.schemaRepository.where({
      realm,
      id: { $in: ids },
    });

    if (entities?.length < ids?.length)
      throw new UnprocessableEntityException(
        `N/A [ realm: ${realm} | id: ${ids.filter((id) => !entities.find(({ _id }) => _id === id))} ]`,
      );

    return reduceEntities(this.factory.config.resolveEnv, entities);
  }

  async paginate(take: number, skip: number) {
    return (await this.schemaRepository.find(take, skip)).map(({ value, ...rest }) => {
      try {
        return { ...rest, value: JSON.parse(value) };
      } catch {
        return { ...rest, value };
      }
    });
  }

  async deleteRealm(realm: string) {
    const entity = await this.schemaRepository.delete(realm);
    if (!entity.deletedCount) return entity;
    this.redisPubSubClient?.emit(realm, { deletedRealm: realm }).pipe(catchError((error) => error));
    this.bullmq?.add(BULLMQ_DELETE_SCHEMA, { deletedRealm: realm }).catch((error) => error);
    return entity;
  }

  async deleteRealmConfigIds(realm: string, ids: string[]) {
    const entity = await this.schemaRepository.delete(realm, ids);
    if (!entity.deletedCount) return entity;
    this.redisPubSubClient?.emit(realm, { deletedConfigIds: ids }).pipe(catchError((error) => error));
    this.bullmq?.add(BULLMQ_DELETE_SCHEMA_CONFIGS, { realm, deletedConfigIds: ids }).catch((error) => error);
    return entity;
  }

  async downloadConfigFile(realms?: string[]) {
    if (!realms) {
      const entities = await this.schemaRepository.findAll();
      const realms = Array.from(new Set(entities.map(({ realm }) => realm)));
      return mapEntitiesToConfigFile(entities, realms);
    }

    const realmSet = Array.from(new Set(realms.map((space) => space.trim())));
    const entities = await this.schemaRepository.where({ realm: { $in: realmSet } });
    return mapEntitiesToConfigFile(entities, realms);
  }
}
