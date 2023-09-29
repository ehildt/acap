import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Queue } from 'bullmq';

import { AppConfigServices } from '@/configs/config-yml/config.model';
import { BULLMQ_REALM_QUEUE, REDIS_PUBSUB } from '@/constants/app.constants';
import { BreakoutUpsertReq } from '@/dtos/breakout-upsert.dto.req';
import { MQTT_CLIENT, MqttClient } from '@/modules/mqtt-client.module';

import { ConfigFactoryService } from './config-factory.service';

@Injectable()
export class OutbreakService {
  constructor(
    private readonly factory: ConfigFactoryService,
    @Optional() @Inject(REDIS_PUBSUB) private readonly redisPubSub: ClientProxy,
    @Optional() @InjectQueue(BULLMQ_REALM_QUEUE) private readonly bullmq: Queue,
    @Optional() @Inject(MQTT_CLIENT) private readonly mqtt: MqttClient,
  ) {}

  async delegate(reqs: Array<BreakoutUpsertReq>, args: AppConfigServices) {
    reqs.forEach(({ realm, contents }) => {
      contents.forEach(({ content, jobOptions }) => {
        args.useRedisPubSub && this.redisPubSub?.emit(realm, content);
        args.useMQTT && this.mqtt?.publish(realm, JSON.stringify(content));
        args.useBullMQ && this.bullmq?.add(realm, content, jobOptions).catch((error) => error);
      });
    });
  }
}
