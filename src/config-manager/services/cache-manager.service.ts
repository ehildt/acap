import { Cache } from 'cache-manager';
import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigManagerUpsertReq } from '../dtos/config-manager-upsert-req.dto';

const NO_CONTENT = 'NoContent';

const reduceList = (list: Array<any>) =>
  list?.reduce(
    (acc, { configId, value }) => ({ ...acc, [configId]: value }),
    {},
  );

@Injectable()
export class CacheManagerService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async upsert(namespace: string, req: ConfigManagerUpsertReq[]) {
    const cache = (await this.cacheManager.get(namespace)) ?? ({} as any);
    const data = { ...cache, ...reduceList(req) };
    return this.cacheManager.set(namespace, data);
  }

  async upsertFromEntities(namespace: string, entities: any) {
    const cache = (await this.cacheManager.get(namespace)) ?? ({} as any);
    const data = { ...cache, ...entities };
    await this.cacheManager.set(namespace, data);
  }

  async getByServiceId(namespace: string) {
    const cache = await this.cacheManager.get(namespace);
    if (!cache) throw new HttpException(NO_CONTENT, HttpStatus.NO_CONTENT);
    return cache;
  }

  async getByServiceIdConfigIds(namespace: string, configIds: string[]) {
    const cache = (await this.cacheManager.get(namespace)) ?? ({} as any);
    const keys = Object.keys(cache);
    const matchedKeys = keys.filter((c) => configIds.includes(c));

    if (matchedKeys?.length === configIds?.length)
      return keys.reduce((acc, key) => ({ ...acc, [key]: cache[key] }), {});

    throw new UnprocessableEntityException({
      message: `N/A (config): ${configIds.filter(
        (id) => !keys.find((k) => k === id),
      )}`,
    });
  }

  async deleteByServiceId(namespace: string) {
    return this.cacheManager.del(namespace);
  }

  async deleteByServiceIdConfigId(namespace: string, configIds?: string[]) {
    const cache = (await this.cacheManager.get(namespace)) ?? ({} as any);
    const keys = Object.keys(cache).filter(
      (key) => delete cache[configIds.find((id) => id === key)],
    );

    if (keys.length) {
      await this.cacheManager.set(namespace, cache);
      return cache;
    }

    return this.cacheManager.del(namespace);
  }
}
