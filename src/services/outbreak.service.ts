import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Queue } from 'bullmq';

import { AppConfigServices } from '@/configs/config-yml/config.model';
import { BULLMQ_REALMS_QUEUE, REDIS_PUBSUB } from '@/constants/app.constants';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { challengeContentValue } from '@/helpers/challenge-content-source.helper';
import { MQTT_CLIENT, MqttClient } from '@/modules/mqtt-client.module';

import { ConfigFactoryService } from './config-factory.service';

@Injectable()
export class OutbreakService {
  constructor(
    private readonly factory: ConfigFactoryService,
    @Optional() @Inject(REDIS_PUBSUB) private readonly redisPubSub: ClientProxy,
    @Optional() @InjectQueue(BULLMQ_REALMS_QUEUE) private readonly bullmq: Queue,
    @Optional() @Inject(MQTT_CLIENT) private readonly mqtt: MqttClient,
  ) {}

  async delegate(reqs: Array<RealmsUpsertReq>, args: AppConfigServices) {
    const resolveEnv = this.factory.app.realm.resolveEnv;
    if (!args.useRedisPubSub && !args.useMQTT && !args.useBullMQ) return;
    reqs.forEach(({ realm, contents }) => {
      const data = contents.map(({ id, value }) => ({ id, value: challengeContentValue(value, resolveEnv) }));
      args.useRedisPubSub && this.redisPubSub?.emit(realm, data);
      args.useMQTT && this.mqtt?.publish(realm, data);
      args.useBullMQ && this.bullmq?.add(realm, data).catch((error) => error);
    });
  }
}
