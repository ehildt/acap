import { Inject, Injectable, Optional } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { REDIS_PUBSUB } from '@/constants/app.constants';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { challengeContentValue } from '@/helpers/challenge-content-source.helper';

import { ConfigFactoryService } from './config-factory.service';

@Injectable()
export class PubSubService {
  constructor(
    private readonly factory: ConfigFactoryService,
    @Optional() @Inject(REDIS_PUBSUB) private readonly client: ClientProxy,
  ) {}

  async passThrough(reqs: Array<RealmsUpsertReq>) {
    if (!this.client) return;
    reqs.map((req) => {
      this.client?.emit(
        req.realm,
        req.contents.map(({ id, value }) => ({
          id,
          value: challengeContentValue(value as any, this.factory.app.realm.resolveEnv),
        })),
      );
    });
  }
}
