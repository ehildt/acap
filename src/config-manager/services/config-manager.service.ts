import { CACHE_MANAGER, Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';

import { ConfigFactoryService } from '../configs/config-factory.service';
import { Publisher } from '../constants/publisher.enum';
import { ConfigManagerUpsertNamespaceReq } from '../dtos/config-manager-upsert-by-namespace.dto.req';
import { ConfigManagerUpsertReq } from '../dtos/config-manager-upsert-req.dto';
import { ConfigManagerRepository } from './config-manager.repository';
import { challengeConfigValue } from './helpers/challenge-config-source.helper';
import { mapEntitiesToConfigFile } from './helpers/map-entities-to-config-file.helper';
import { reduceEntities } from './helpers/reduce-entities.helper';
import { reduceToNamespaces } from './helpers/reduce-to-namespaces.helper';

@Injectable()
export class ConfigManagerService {
  constructor(
    private readonly configRepo: ConfigManagerRepository,
    private readonly factory: ConfigFactoryService,
    @Inject(Publisher.TOKEN) private client: ClientProxy,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async upsertNamespace(namespace: string, req: ConfigManagerUpsertReq[]) {
    const result = await this.configRepo.upsert(namespace, req);
    const configIds = req.map(({ configId }) => configId);
    if (result?.ok) {
      const data = await this.configRepo.where({ namespace });
      await this.cache.set(namespace, data, this.factory.redis.ttl);
      this.factory.publisher.publishEvents && (await firstValueFrom(this.client.emit(namespace, configIds)));
    }
    return result;
  }

  async upsertNamespaces(reqs: ConfigManagerUpsertNamespaceReq[]) {
    const result = await this.configRepo.upsertMany(reqs);

    if (result?.ok) {
      const namespaces = reqs.map(({ namespace }) => namespace);
      const entities = await this.configRepo.where({ namespace: { $in: namespaces } });
      const data = entities.reduce((acc, val) => reduceToNamespaces(acc, val, this.factory.config.resolveEnv), {});

      await Promise.all(
        Object.keys(data).map(async (namespace) => {
          const postfix = `$${namespace} @${this.factory.config.namespacePostfix}`;
          await this.cache.set(postfix, data[namespace], this.factory.redis.ttl);
        }),
      );

      await Promise.all(
        reqs.map(async (req) => {
          return (
            this.factory.publisher.publishEvents &&
            (await firstValueFrom(
              this.client.emit(
                req.namespace,
                req.configs.map(({ configId }) => configId),
              ),
            ))
          );
        }),
      );
    }

    return result;
  }

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

  async paginate(take: number, skip: number) {
    return (await this.configRepo.find(take, skip)).map(({ value, ...rest }) => {
      try {
        return { ...rest, value: JSON.parse(value) };
      } catch {
        return { ...rest, value };
      }
    });
  }

  async getNamespaces(namespaces: string[]) {
    const spaces = Array.from(new Set(namespaces.map((space) => space.trim())));
    const entities = await this.configRepo.where({ namespace: { $in: spaces } });
    return entities?.reduce((acc, val) => reduceToNamespaces(acc, val, this.factory.config.resolveEnv), {});
  }

  async downloadConfigFile(namespaces?: string[]) {
    if (!namespaces) {
      const entities = await this.configRepo.findAll();
      const namespaces = Array.from(new Set(entities.map(({ namespace }) => namespace)));
      return mapEntitiesToConfigFile(entities, namespaces);
    }

    const spaces = Array.from(new Set(namespaces.map((space) => space.trim())));
    const entities = await this.configRepo.where({ namespace: { $in: spaces } });
    return mapEntitiesToConfigFile(entities, namespaces);
  }

  async getNamespace(namespace: string) {
    return await this.configRepo.where({ namespace });
  }

  async getNamespaceConfigIds(namespace: string, ids: string[]) {
    const entities = await this.configRepo.where({
      namespace,
      configId: { $in: ids },
    });

    if (entities?.length < ids?.length)
      throw new UnprocessableEntityException(
        `N/A [ namespace: ${namespace} | configId: ${ids.filter(
          (id) => !entities.find(({ configId }) => configId === id),
        )} ]`,
      );

    return reduceEntities(this.factory.config.resolveEnv, entities);
  }

  async deleteNamespace(namespace: string) {
    const entity = await this.configRepo.delete(namespace);
    if (entity && this.factory.publisher.publishEvents) await firstValueFrom(this.client.emit(namespace, {}));
    return entity;
  }

  async deleteNamespaceConfigIds(namespace: string, configIds: string[]) {
    const entity = await this.configRepo.delete(namespace, configIds);
    if (entity && this.factory.publisher.publishEvents) await firstValueFrom(this.client.emit(namespace, configIds));
    return entity;
  }
}
