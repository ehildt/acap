import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';

import { Publisher } from '@/constants/publisher.enum';
import { ConfigManagerUpsertRealmReq } from '@/dtos/config-manager-upsert-by-realm.dto.req';
import { ConfigManagerUpsertReq } from '@/dtos/config-manager-upsert-req.dto';
import { challengeConfigValue } from '@/helpers/challenge-config-source.helper';
import { mapEntitiesToConfigFile } from '@/helpers/map-entities-to-config-file.helper';
import { reduceEntities } from '@/helpers/reduce-entities.helper';
import { reduceToRealms } from '@/helpers/reduce-to-realms.helper';
import { ConfigManagerRepository } from '@/repositories/config-manager.repository';

import { ConfigFactoryService } from './config-factory.service';

@Injectable()
export class ManagerService {
  constructor(
    private readonly configRepo: ConfigManagerRepository,
    private readonly factory: ConfigFactoryService,
    @Inject(Publisher.TOKEN) private client: ClientProxy,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async upsertRealm(realm: string, req: ConfigManagerUpsertReq[]) {
    const result = await this.configRepo.upsert(realm, req);
    const configIds = req.map(({ configId }) => configId);
    if (result?.ok) {
      const data = await this.configRepo.where({ realm });
      await this.cache.set(realm, data, this.factory.config.ttl);
      this.factory.publisher.publishEvents && (await firstValueFrom(this.client.emit(realm, configIds)));
    }
    return result;
  }

  async upsertRealms(reqs: ConfigManagerUpsertRealmReq[]) {
    const result = await this.configRepo.upsertMany(reqs);

    if (result?.ok) {
      const realms = reqs.map(({ realm }) => realm);
      const entities = await this.configRepo.where({ realm: { $in: realms } });
      const data = entities.reduce((acc, val) => reduceToRealms(acc, val, this.factory.config.resolveEnv), {});

      await Promise.all(
        Object.keys(data).map(async (realm) => {
          const postfix = `$${realm} @${this.factory.config.namespacePostfix}`;
          await this.cache.set(postfix, data[realm], this.factory.config.ttl);
        }),
      );

      await Promise.all(
        reqs.map(async (req) => {
          return (
            this.factory.publisher.publishEvents &&
            (await firstValueFrom(
              this.client.emit(
                req.realm,
                req.configs.map(({ configId }) => configId),
              ),
            ))
          );
        }),
      );
    }

    return result;
  }

  async passThrough(reqs: ConfigManagerUpsertRealmReq[]) {
    await Promise.all(
      reqs.map(async (req) => {
        return (
          this.factory.publisher.publishEvents &&
          (await firstValueFrom(
            this.client.emit(
              req.realm,
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
    const spaces = Array.from(new Set(realms.map((space) => space.trim())));
    const entities = await this.configRepo.where({ realm: { $in: spaces } });
    return entities?.reduce((acc, val) => reduceToRealms(acc, val, this.factory.config.resolveEnv), {});
  }

  async downloadConfigFile(realms?: string[]) {
    if (!realms) {
      const entities = await this.configRepo.findAll();
      const realms = Array.from(new Set(entities.map(({ realm }) => realm)));
      return mapEntitiesToConfigFile(entities, realms);
    }

    const spaces = Array.from(new Set(realms.map((space) => space.trim())));
    const entities = await this.configRepo.where({ realm: { $in: spaces } });
    return mapEntitiesToConfigFile(entities, realms);
  }

  async getRealm(realm: string) {
    return await this.configRepo.where({ realm });
  }

  async getRealmConfigIds(realm: string, ids: string[]) {
    const entities = await this.configRepo.where({
      realm,
      configId: { $in: ids },
    });

    if (entities?.length < ids?.length)
      throw new UnprocessableEntityException(
        `N/A [ realm: ${realm} | configId: ${ids.filter((id) => !entities.find(({ configId }) => configId === id))} ]`,
      );

    return reduceEntities(this.factory.config.resolveEnv, entities);
  }

  async deleteRealm(realm: string) {
    const entity = await this.configRepo.delete(realm);
    if (entity && this.factory.publisher.publishEvents) await firstValueFrom(this.client.emit(realm, {}));
    return entity;
  }

  async deleteRealmConfigIds(realm: string, configIds: string[]) {
    const entity = await this.configRepo.delete(realm, configIds);
    if (entity && this.factory.publisher.publishEvents) await firstValueFrom(this.client.emit(realm, configIds));
    return entity;
  }
}
