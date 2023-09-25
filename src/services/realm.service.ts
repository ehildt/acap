import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, InternalServerErrorException, NotFoundException, Optional } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Queue } from 'bullmq';
import { catchError } from 'rxjs';

import { BULLMQ_REALMS_QUEUE, REDIS_PUBSUB } from '@/constants/app.constants';
import { ContentUpsertReq } from '@/dtos/content-upsert-req.dto';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { reduceEntities } from '@/helpers/reduce-entities.helper';
import { MQTT_CLIENT, MqttClient } from '@/modules/mqtt-client.module';
import { RealmRepository } from '@/repositories/realm.repository';

import { ConfigFactoryService } from './config-factory.service';
import { CryptoService } from './crypto.service';

@Injectable()
export class RealmService {
  constructor(
    private readonly configRepo: RealmRepository,
    private readonly factory: ConfigFactoryService,
    private readonly cryptoService: CryptoService,
    @Optional() @Inject(REDIS_PUBSUB) private readonly redisPubSubClient: ClientProxy,
    @Optional() @InjectQueue(BULLMQ_REALMS_QUEUE) private readonly bullmq: Queue,
    @Optional() @Inject(MQTT_CLIENT) private readonly mqttClient: MqttClient,
  ) {}

  async upsertRealm(realm: string, reqs: Array<ContentUpsertReq>) {
    const payload = this.factory.app.crypto.cryptable ? this.cryptoService.encryptContentUpsertReqs(reqs) : reqs;
    const result = await this.configRepo.upsert(realm, payload);
    if (!result?.ok) throw new InternalServerErrorException(result);
    this.redisPubSubClient?.emit(realm, reqs).pipe(catchError((error) => error));
    this.bullmq?.add(realm, reqs).catch((error) => error);
    this.mqttClient?.publish(realm, reqs);
    return result;
  }

  async upsertRealms(reqs: Array<RealmsUpsertReq>) {
    const payload = this.factory.app.crypto.cryptable ? this.cryptoService.encryptRealmsUpsertReq(reqs) : reqs;
    const result = await this.configRepo.upsertMany(payload);
    if (!result?.ok) throw new InternalServerErrorException(result);
    if (this.redisPubSubClient || this.mqttClient)
      reqs.forEach(({ realm, contents }) => {
        this.redisPubSubClient?.emit(realm, contents).pipe(catchError((error) => error));
        this.mqttClient?.publish(realm, contents);
        this.bullmq?.add(realm, contents).catch((error) => error);
      });
    return result;
  }

  async getRealmContentByIds(realm: string, ids: Array<string>) {
    const entities = await this.configRepo.where({ realm, id: { $in: ids } });

    if (entities?.length < ids?.length)
      throw new NotFoundException(
        `No such ID::${ids.filter((id) => !entities.find(({ _id }) => _id === id))} in REALM::${realm}`,
      );

    return !this.factory.app.crypto.cryptable
      ? reduceEntities(this.factory.app.realm.resolveEnv, entities)
      : reduceEntities(this.factory.app.realm.resolveEnv, this.cryptoService.decryptEntityValues(entities));
  }

  async deleteRealm(realm: string) {
    const entity = await this.configRepo.delete(realm);
    if (!entity.deletedCount) throw new NotFoundException(entity);
    this.redisPubSubClient?.emit(realm, null).pipe(catchError((error) => error));
    this.bullmq?.add(realm, null).catch((error) => error);
    this.mqttClient?.publish(realm, null);
    return entity;
  }

  async deleteRealmContentByIds(realm: string, ids: Array<string>) {
    const entity = await this.configRepo.delete(realm, ids);
    if (!entity.deletedCount) throw new NotFoundException(entity);
    this.redisPubSubClient?.emit(realm, ids).pipe(catchError((error) => error));
    this.bullmq?.add(realm, ids).catch((error) => error);
    this.mqttClient?.publish(realm, ids);
    return entity;
  }

  async getRealm(realm: string) {
    const entities = await this.configRepo.where({ realm });
    return !this.factory.app.crypto.cryptable ? entities : this.cryptoService.decryptEntityValues(entities);
  }

  async countRealmContents() {
    return await this.configRepo.countContents();
  }

  async countRealms() {
    return await this.configRepo.countRealms();
  }
}
