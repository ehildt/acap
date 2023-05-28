import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { Publisher } from '@/constants/publisher.enum';
import { ConfigManagerUpsertNamespaceReq } from '@/dtos/config-manager-upsert-by-namespace.dto.req';
import { challengeConfigValue } from '@/helpers/challenge-config-source.helper';

import { ConfigFactoryService } from './config-factory.service';

@Injectable()
export class PubSubService {
  constructor(private readonly factory: ConfigFactoryService, @Inject(Publisher.TOKEN) private client: ClientProxy) {}

  async passThrough(reqs: ConfigManagerUpsertNamespaceReq[]) {
    await Promise.all(
      reqs.map(async (req) => {
        return (
          this.factory.publisher.publishEvents &&
          (await firstValueFrom(
            this.client.emit(
              req.namespace,
              req.configs.map(({ configId, value }) => ({
                configId,
                value: challengeConfigValue(value as any, this.factory.config.resolveEnv),
              })),
            ),
          ))
        );
      }),
    );
  }
}
