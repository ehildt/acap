import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { Publisher } from '@/constants/publisher.enum';
import { RealmUpsertReq } from '@/dtos/realm-upsert-req.dto';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { challengeConfigValue } from '@/helpers/challenge-config-source.helper';
import { mapEntitiesToConfigFile } from '@/helpers/map-entities-to-config-file.helper';
import { reduceEntities } from '@/helpers/reduce-entities.helper';
import { reduceToRealms } from '@/helpers/reduce-to-realms.helper';
import { RealmRepository } from '@/repositories/realm.repository';

import { ConfigFactoryService } from './config-factory.service';

@Injectable()
export class RealmService {
  constructor(
    private readonly configRepo: RealmRepository,
    private readonly factory: ConfigFactoryService,
    @Inject(Publisher.TOKEN) private client: ClientProxy,
  ) {}

  async upsertRealm(realm: string, req: RealmUpsertReq[]) {
    const result = await this.configRepo.upsert(realm, req);
    const ids = req.map(({ id }) => id);
    if (result?.ok) this.factory.publisher.publishEvents && (await firstValueFrom(this.client.emit(realm, ids)));
    return result;
  }

  async upsertRealms(reqs: RealmsUpsertReq[]) {
    const result = await this.configRepo.upsertMany(reqs);

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

  async passThrough(reqs: RealmsUpsertReq[]) {
    await Promise.all(
      reqs.map(async (req) => {
        return (
          this.factory.publisher.publishEvents &&
          (await firstValueFrom(
            this.client.emit(
              req.realm,
              req.configs.map(({ id, value }) => ({
                id,
                value: challengeConfigValue(value as any, this.factory.config.resolveEnv),
              })),
            ),
          ))
        );
      }),
    );
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
    if (entity && this.factory.publisher.publishEvents) await firstValueFrom(this.client.emit(realm, {}));
    return entity;
  }

  async deleteRealmConfigIds(realm: string, ids: string[]) {
    const entity = await this.configRepo.delete(realm, ids);
    if (entity && this.factory.publisher.publishEvents) await firstValueFrom(this.client.emit(realm, ids));
    return entity;
  }
}
