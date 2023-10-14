import zlib from 'zlib';

import { gzipSyncCacheObject } from './gzip-sync-cache-object.helper';

describe('gzipSyncCacheObject', () => {
  it('should return a zipped CacheObject when size exceeds threshold', () => {
    const content: Record<any, any> = { key: 'value'.repeat(256) };
    const threshold = 1; // set a low threshold to force zipping
    const count = 10;
    const result = gzipSyncCacheObject(content, threshold, count);
    expect(result.zipped).toBe(true);
    expect(result.content instanceof Buffer).toBe(true);
    expect(result.count).toBe(count);
    expect(zlib.unzipSync(result.content)).toEqual(Buffer.from(JSON.stringify(content)));
  });

  it('should return an unzipped CacheObject when size does not exceed threshold', () => {
    const content: Record<any, any> = { key: 'value' };
    const threshold = 1024; // set a high threshold to avoid zipping
    const count = 5;
    const result = gzipSyncCacheObject(content, threshold, count);
    expect(result.zipped).toBe(false);
    expect(result.content).toEqual(content);
    expect(result.count).toBe(count);
  });
});
