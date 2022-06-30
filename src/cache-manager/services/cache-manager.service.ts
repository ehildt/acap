import { Cache } from 'cache-manager';
import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CacheManagerUpsertReq } from '../dtos/cache-manager-upsert-req.dto';
import { reduceEntities } from './helpers/reduce-entities.helper';

@Injectable()
export class CacheManagerService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async upsert(serviceId: string, req: CacheManagerUpsertReq[], ttl = 0) {
    const cache = (await this.cacheManager.get(serviceId)) ?? ({} as any);
    const data = { ...cache, ...reduceEntities(req) };
    await this.cacheManager.set(serviceId, data, { ttl });
    return data;
  }

  async getByServiceId(serviceId: string) {
    const cache = (await this.cacheManager.get(serviceId)) ?? {};
    if (Object.keys(cache)?.length) return cache;
    throw new UnprocessableEntityException(`N/A serviceId: ${serviceId}`);
  }

  async getByServiceIdConfigIds(serviceId: string, configIds: string[]) {
    const cache = (await this.cacheManager.get(serviceId)) ?? ({} as any);
    const matchedKeys = Object.keys(cache).filter((c) => configIds.includes(c));

    if (matchedKeys?.length >= configIds?.length)
      return matchedKeys.reduce(
        (acc, key) => ({ ...acc, [key]: cache[key] }),
        {},
      );

    return cache;
  }

  async deleteByServiceId(serviceId: string) {
    return this.cacheManager.del(serviceId);
  }

  async deleteByServiceIdConfigId(serviceId: string, configIds?: string[]) {
    const cache = (await this.cacheManager.get(serviceId)) ?? ({} as any);
    const keys = Object.keys(cache).filter(
      (key) => delete cache[configIds.find((id) => id === key)],
    );

    if (keys.length) return this.cacheManager.set(serviceId, cache);
    return this.cacheManager.del(serviceId);
  }
}
