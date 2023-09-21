import zlib from 'zlib';

import { CacheObject, gunzipSyncCacheObject } from './gunzip-sync-cache-object.helper';

const SAMPLE_CONTENT = { name: 'Gandalf', job: 'Mage' };

describe('gunzipSyncCacheObject', () => {
  it('should return CACHE_DEFAULT when cacheObj is undefined', () => {
    const result = gunzipSyncCacheObject(undefined);
    expect(result).toEqual({ zipped: false, content: {}, count: undefined });
  });

  it('should return the cacheObj with the unzipped content when cacheObj is zipped', () => {
    const zippedContent = zlib.gzipSync(Buffer.from(JSON.stringify(SAMPLE_CONTENT)));
    const cacheObj: CacheObject = { zipped: true, content: zippedContent };
    const result = gunzipSyncCacheObject(cacheObj);
    expect(result.zipped).toBe(true);
    expect(result.content).toStrictEqual(SAMPLE_CONTENT);
    expect(result.count).toBeUndefined();
  });

  it('should return the same cacheObj when cacheObj is not zipped', () => {
    const cacheObj: CacheObject = { zipped: false, content: SAMPLE_CONTENT, count: 10 };
    const result = gunzipSyncCacheObject(cacheObj);
    expect(result).toEqual(cacheObj);
  });
});
