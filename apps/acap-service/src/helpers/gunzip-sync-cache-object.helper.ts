import zlib from 'zlib';

export type CacheObject = { zipped: boolean; content: any; count?: number };

const CACHE_DEFAULT: CacheObject = { zipped: false, content: {}, count: undefined };

export function gunzipSyncCacheObject(cacheObj?: CacheObject): CacheObject {
  if (!cacheObj) return CACHE_DEFAULT;
  return cacheObj.zipped
    ? { ...cacheObj, content: JSON.parse(zlib.gunzipSync(Buffer.from(cacheObj.content)).toString()) }
    : cacheObj;
}
