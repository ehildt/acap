import zlib from 'zlib';

import { CacheObject } from './gunzip-sync-cache-object.helper';

/**
 * naively calculates the objects estimated size in memory
 * @param content any json object
 * @returns size in kilobyte
 */
function sizeOf(content: Record<any, any>) {
  return parseInt((Buffer.byteLength(JSON.stringify(content)) / 1024).toFixed(), 10);
}

export function gzipSyncCacheObject(content: Record<any, any>, threshold: number, count?: number): CacheObject {
  return sizeOf(content) > threshold
    ? { zipped: true, content: zlib.gzipSync(Buffer.from(JSON.stringify(content))), count }
    : { content, count, zipped: false };
}
