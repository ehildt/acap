import { Inject, Injectable, Optional } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { REDIS_PUBSUB } from '@/constants/app.constants';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { challengeConfigValue } from '@/helpers/challenge-config-source.helper';

import { ConfigFactoryService } from './config-factory.service';

@Injectable()
export class PubSubService {
  constructor(
    private readonly factory: ConfigFactoryService,
    @Optional() @Inject(REDIS_PUBSUB) private readonly client: ClientProxy,
  ) {}

  async passThrough(reqs: Array<RealmsUpsertReq>) {
    reqs.map((req) => {
      this.factory.redisPubSub.isUsed &&
        this.client.emit(
          req.realm,
          req.configs.map(({ id, value }) => ({
            id,
            value: challengeConfigValue(value as any, this.factory.config.resolveEnv),
          })),
        );
    });
  }
}
