import { Cache } from 'cache-manager';
import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigFactoryService } from '../configs/config-factory.service';
import { CacheManagerUpsertReq } from '../dtos/cache-manager-upsert-req.dto';
import { reduceEntities } from './helpers/reduce-entities.helper';

@Injectable()
export class CacheManagerService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly cacheFactory: ConfigFactoryService,
  ) {}

  async upsert(serviceId: string, req: CacheManagerUpsertReq[], ttl: number) {
    const prefixId = `${this.cacheFactory.cache.namespacePrefix}_${serviceId}`;
    const cache = (await this.cacheManager.get(prefixId)) ?? ({} as any);
    const data = { ...cache, ...reduceEntities(req) };
    await this.cacheManager.set(prefixId, data, {
      ttl: ttl ?? this.cacheFactory.cache.ttl,
    });
    return data;
  }

  async getByServiceId(serviceId: string) {
    const cache =
      (await this.cacheManager.get(
        `${this.cacheFactory.cache.namespacePrefix}_${serviceId}`,
      )) ?? {};
    if (Object.keys(cache)?.length) return cache;
    throw new UnprocessableEntityException(`N/A serviceId: ${serviceId}`);
  }

  async getByServiceIdConfigIds(serviceId: string, configIds: string[]) {
    const cache =
      (await this.cacheManager.get(
        `${this.cacheFactory.cache.namespacePrefix}_${serviceId}`,
      )) ?? ({} as any);
    const matchedKeys = Object.keys(cache).filter((c) => configIds.includes(c));

    if (matchedKeys?.length >= configIds?.length)
      return matchedKeys.reduce(
        (acc, key) => ({ ...acc, [key]: cache[key] }),
        {},
      );

    return cache;
  }

  async deleteByServiceId(serviceId: string) {
    return this.cacheManager.del(
      `${this.cacheFactory.cache.namespacePrefix}_${serviceId}`,
    );
  }

  async deleteByServiceIdConfigId(serviceId: string, configIds?: string[]) {
    const prefixId = `${this.cacheFactory.cache.namespacePrefix}_${serviceId}`;
    const cache = (await this.cacheManager.get(prefixId)) ?? ({} as any);
    const keys = Object.keys(cache).filter(
      (key) => delete cache[configIds.find((id) => id === key)],
    );

    if (keys.length)
      return this.cacheManager.set(prefixId, cache, {
        ttl: this.cacheFactory.cache.ttl,
      });
    return this.cacheManager.del(prefixId);
  }
}
