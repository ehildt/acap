import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Queue } from 'bullmq';

import { AppConfigBrokers } from '@/configs/config-yml/config.model';
import { BULLMQ_REALM_QUEUE, REDIS_PUBSUB } from '@/constants/app.constants';
import { BreakoutUpsertReq } from '@/dtos/breakout-upsert.dto.req';
import { MQTT_CLIENT, MqttClient } from '@/modules/mqtt-client.module';

@Injectable()
export class OutbreakService {
  constructor(
    @Optional() @Inject(REDIS_PUBSUB) private readonly redisPubSub: ClientProxy,
    @Optional() @InjectQueue(BULLMQ_REALM_QUEUE) private readonly bullmq: Queue,
    @Optional() @Inject(MQTT_CLIENT) private readonly mqtt: MqttClient,
  ) {}

  async delegate(reqs: Array<BreakoutUpsertReq>, args: AppConfigBrokers) {
    reqs.forEach(({ realm, contents }) => {
      contents.forEach(({ value, jobOptions }) => {
        args.useRedisPubSub && this.redisPubSub?.emit(realm, value);
        args.useMQTT && this.mqtt?.publish(realm, JSON.stringify(value));
        args.useBullMQ && this.bullmq?.add(realm, value, jobOptions).catch((error) => error);
      });
    });
  }
}
