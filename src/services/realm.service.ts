import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, Optional, UnprocessableEntityException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Queue } from 'bullmq';
import { catchError } from 'rxjs';

import {
  BULLMQ_DELETE_REALM,
  BULLMQ_DELETE_REALM_CONFIGS,
  BULLMQ_REALMS_QUEUE,
  BULLMQ_UPSERT_REALM,
  REDIS_PUBSUB,
} from '@/constants/app.constants';
import { ContentUpsertReq } from '@/dtos/content-upsert-req.dto';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { mapEntitiesToConfigFile } from '@/helpers/map-entities-to-config-file.helper';
import { reduceEntities } from '@/helpers/reduce-entities.helper';
import { reduceToRealms } from '@/helpers/reduce-to-realms.helper';
import { MQTT_CLIENT, MqttClient } from '@/modules/mqtt-client.module';
import { RealmRepository } from '@/repositories/realm.repository';

import { ConfigFactoryService } from './config-factory.service';

@Injectable()
export class RealmService {
  constructor(
    private readonly configRepo: RealmRepository,
    private readonly factory: ConfigFactoryService,
    @Optional() @Inject(REDIS_PUBSUB) private readonly redisPubSubClient: ClientProxy,
    @Optional() @InjectQueue(BULLMQ_REALMS_QUEUE) private readonly bullmq: Queue,
    @Optional() @Inject(MQTT_CLIENT) private readonly mqttClient: MqttClient,
  ) {}

  async countRealmContents() {
    return await this.configRepo.count();
  }

  async upsertRealm(realm: string, req: ContentUpsertReq[]) {
    const result = await this.configRepo.upsert(realm, req);
    if (!result?.ok) return result;
    this.redisPubSubClient?.emit(realm, req).pipe(catchError((error) => error));
    this.bullmq?.add(BULLMQ_UPSERT_REALM, { realm, configs: req }).catch((error) => error);
    this.mqttClient?.publish(realm, req);
    return result;
  }

  async upsertRealms(reqs: RealmsUpsertReq[]) {
    const result = await this.configRepo.upsertMany(reqs);
    if (result?.ok) return result;
    if (this.redisPubSubClient || this.mqttClient)
      reqs.forEach(({ realm, contents }) => {
        this.redisPubSubClient?.emit(realm, contents).pipe(catchError((error) => error));
        this.mqttClient?.publish(realm, contents);
      });
    this.bullmq?.addBulk(reqs.map((data) => ({ name: BULLMQ_UPSERT_REALM, data }))).catch((error) => error);
    return result;
  }

  async paginate(take: number, skip: number) {
    return (await this.configRepo.find(take, skip)).map(({ value, ...rest }) => {
      try {
        return { ...rest, value: JSON.parse(value) };
      } catch {
        return { ...rest, value };
      }
    });
  }

  async getRealms(realms: string[]) {
    const realmSet = Array.from(new Set(realms.map((space) => space.trim())));
    const entities = await this.configRepo.where({ realm: { $in: realmSet } });
    return entities?.reduce((acc, val) => reduceToRealms(acc, val, this.factory.config.resolveEnv), {});
  }

  async getRealm(realm: string) {
    return await this.configRepo.where({ realm });
  }

  async getRealmConfigIds(realm: string, ids: string[]) {
    const entities = await this.configRepo.where({
      realm,
      id: { $in: ids },
    });

    if (entities?.length < ids?.length)
      throw new UnprocessableEntityException(
        `N/A [ realm: ${realm} | id: ${ids.filter((id) => !entities.find(({ _id }) => _id === id))} ]`,
      );

    return reduceEntities(this.factory.config.resolveEnv, entities);
  }

  async deleteRealm(realm: string) {
    const entity = await this.configRepo.delete(realm);
    if (!entity.deletedCount) return entity;
    this.redisPubSubClient?.emit(realm, { deletedRealm: realm }).pipe(catchError((error) => error));
    this.bullmq?.add(BULLMQ_DELETE_REALM, { deletedRealm: realm }).catch((error) => error);
    this.mqttClient?.publish(realm, { deletedRealm: realm });
    return entity;
  }

  async deleteRealmConfigIds(realm: string, ids: string[]) {
    const entity = await this.configRepo.delete(realm, ids);
    if (!entity.deletedCount) return entity;
    this.redisPubSubClient?.emit(realm, { deletedConfigIds: ids }).pipe(catchError((error) => error));
    this.bullmq?.add(BULLMQ_DELETE_REALM_CONFIGS, { deletedConfigIds: ids }).catch((error) => error);
    this.mqttClient?.publish(realm, { deletedConfigIds: ids });
    return entity;
  }

  async downloadConfigFile(realms?: string[]) {
    if (!realms) {
      const entities = await this.configRepo.findAll();
      const realms = Array.from(new Set(entities.map(({ realm }) => realm)));
      return mapEntitiesToConfigFile(entities, realms);
    }

    const realmSet = Array.from(new Set(realms.map((space) => space.trim())));
    const entities = await this.configRepo.where({ realm: { $in: realmSet } });
    return mapEntitiesToConfigFile(entities, realms);
  }
}
