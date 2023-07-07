import zlib from 'zlib';

export type CacheObject = { zipped: boolean; content: any };

const CACHE_DEFAULT: CacheObject = { zipped: false, content: {} };

export function gunzipSyncCacheObject(cacheObj?: CacheObject) {
  if (!cacheObj) return CACHE_DEFAULT.content;
  if (cacheObj.zipped) return JSON.parse(zlib.gunzipSync(Buffer.from(cacheObj.content)).toString());
  return cacheObj.content;
}
