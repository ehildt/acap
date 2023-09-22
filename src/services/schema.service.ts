import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, InternalServerErrorException, NotFoundException, Optional } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Queue } from 'bullmq';
import { catchError } from 'rxjs';

import { BULLMQ_SCHEMAS_QUEUE, REDIS_PUBSUB } from '@/constants/app.constants';
import { ContentUpsertReq } from '@/dtos/content-upsert-req.dto';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { mapEntitiesToContentFile } from '@/helpers/map-entities-to-content-file.helper';
import { reduceEntities } from '@/helpers/reduce-entities.helper';
import { MQTT_CLIENT, MqttClient } from '@/modules/mqtt-client.module';
import { SchemaRepository } from '@/repositories/schema.repository';

import { ConfigFactoryService } from './config-factory.service';

@Injectable()
export class SchemaService {
  constructor(
    private readonly schemaRepository: SchemaRepository,
    private readonly factory: ConfigFactoryService,
    @Optional() @Inject(REDIS_PUBSUB) private readonly redisPubSubClient: ClientProxy,
    @Optional() @InjectQueue(BULLMQ_SCHEMAS_QUEUE) private readonly bullmq: Queue,
    @Optional() @Inject(MQTT_CLIENT) private readonly mqttClient: MqttClient,
  ) {}

  async upsertRealm(realm: string, req: Array<ContentUpsertReq>) {
    const result = await this.schemaRepository.upsert(realm, req);
    if (!result?.ok) throw new InternalServerErrorException(result);
    this.redisPubSubClient?.emit(realm, req).pipe(catchError((error) => error));
    this.bullmq?.add(realm, req).catch((error) => error);
    this.mqttClient?.publish(realm, req);
    return result;
  }

  async upsertRealms(reqs: RealmsUpsertReq[]) {
    const result = await this.schemaRepository.upsertMany(reqs);
    if (!result?.ok) throw new InternalServerErrorException(result);
    if (this.redisPubSubClient || this.mqttClient)
      reqs.forEach(({ realm, contents }) => {
        this.redisPubSubClient?.emit(realm, contents).pipe(catchError((error) => error));
        this.mqttClient?.publish(realm, contents);
      });
    this.bullmq?.addBulk(reqs.map(({ realm, contents }) => ({ name: realm, data: contents }))).catch((error) => error);
    return result;
  }

  async getRealmContentByIds(realm: string, ids: Array<string>) {
    const entities = await this.schemaRepository.where({
      realm,
      id: { $in: ids },
    });

    if (entities?.length < ids?.length)
      throw new NotFoundException(
        `No such ID::${ids.filter((id) => !entities.find(({ _id }) => _id === id))} in REALM::${realm}`,
      );

    return reduceEntities(this.factory.app.realm.resolveEnv, entities);
  }

  async deleteRealm(realm: string) {
    const entity = await this.schemaRepository.delete(realm);
    if (!entity.deletedCount) return entity;
    this.redisPubSubClient?.emit(realm, null).pipe(catchError((error) => error));
    this.bullmq?.add(realm, null).catch((error) => error);
    this.mqttClient?.publish(realm, null);
    return entity;
  }

  async deleteRealmContentByIds(realm: string, ids: Array<string>) {
    const entity = await this.schemaRepository.delete(realm, ids);
    if (!entity.deletedCount) return entity;
    this.redisPubSubClient?.emit(realm, ids).pipe(catchError((error) => error));
    this.bullmq?.add(realm, ids).catch((error) => error);
    this.mqttClient?.publish(realm, ids);
    return entity;
  }

  async downloadContents(realms?: Array<string>) {
    if (!realms) {
      const entities = await this.schemaRepository.findAll();
      const realms = Array.from(new Set(entities.map(({ realm }) => realm)));
      return mapEntitiesToContentFile(entities, realms);
    }

    const realmSet = Array.from(new Set(realms.map((space) => space.trim())));
    const entities = await this.schemaRepository.where({ realm: { $in: realmSet } });
    return mapEntitiesToContentFile(entities, realms);
  }

  async getRealm(realm: string) {
    return await this.schemaRepository.where({ realm });
  }

  async countRealmContents() {
    return await this.schemaRepository.countContents();
  }

  async countSchemas() {
    return await this.schemaRepository.countSchemas();
  }
}
