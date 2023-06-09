import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { Publisher } from '@/constants/publisher.enum';
import { RealmUpsertReq } from '@/dtos/realm-upsert-req.dto';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { reduceEntities } from '@/helpers/reduce-entities.helper';
import { reduceToRealms } from '@/helpers/reduce-to-realms.helper';
import { SchemaRepository } from '@/repositories/schema.repository';

import { ConfigFactoryService } from './config-factory.service';

@Injectable()
export class SchemaService {
  constructor(
    private readonly schemaRepository: SchemaRepository,
    private readonly factory: ConfigFactoryService,
    @Inject(Publisher.TOKEN) private client: ClientProxy,
  ) {}

  async upsertRealm(realm: string, req: RealmUpsertReq[]) {
    const result = await this.schemaRepository.upsert(realm, req);
    const ids = req.map(({ id }) => id);
    if (result?.ok) this.factory.publisher.publishEvents && (await firstValueFrom(this.client.emit(realm, ids)));
    return result;
  }

  async upsertRealms(reqs: RealmsUpsertReq[]) {
    const result = await this.schemaRepository.upsertMany(reqs);

    if (result?.ok) {
      await Promise.all(
        reqs.map(async (req) => {
          return (
            this.factory.publisher.publishEvents &&
            (await firstValueFrom(
              this.client.emit(
                req.realm,
                req.configs.map(({ id }) => id),
              ),
            ))
          );
        }),
      );
    }

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
}
