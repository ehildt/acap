export class RedisConfigAdapter {
  constructor(private copy?: RedisConfigAdapter) {}

  get PASS(): string {
    return this.copy?.PASS ?? process.env.REDIS_PASS;
  }

  get HOST(): string {
    return this.copy?.HOST ?? process.env.REDIS_HOST;
  }

  get PORT(): number {
    return this.copy?.PORT ?? parseInt(process.env.REDIS_PORT, 10);
  }

  get TTL(): number {
    return this.copy?.TTL ?? parseInt(process.env.REDIS_TTL, 10);
  }

  get MAX(): number {
    return this.copy?.MAX ?? parseInt(process.env.REDIS_MAX_RESPONSES, 10);
  }

  get DB_INDEX(): number {
    return this.copy?.DB_INDEX ?? parseInt(process.env.REDIS_DB_INDEX, 10);
  }
}
