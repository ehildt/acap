import { generate } from 'short-uuid';

export class CacheManagerConfigAdapter {
  constructor(private copy?: CacheManagerConfigAdapter) {}

  get NAMESPACE_PREFIX(): string {
    return this.copy?.NAMESPACE_PREFIX ??
      process.env.CACHE_MANAGER_NAMESPACE_PREFIX?.length
      ? process.env.CACHE_MANAGER_NAMESPACE_PREFIX
      : generate();
  }

  get TTL(): number {
    return (
      this.copy?.TTL ?? parseInt(process.env.CACHE_MANAGER_TTL ?? '360', 10)
    );
  }
}
