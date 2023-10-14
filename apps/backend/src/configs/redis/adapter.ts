export class RedisConfigAdapter {
  get PASS(): string {
    return process.env.REDIS_PASS;
  }

  get USER(): string {
    return process.env.REDIS_USER;
  }

  get HOST(): string {
    return process.env.REDIS_HOST;
  }

  get PORT(): number {
    return parseInt(process.env.REDIS_PORT, 10);
  }

  get TTL(): number {
    return parseInt(process.env.REDIS_TTL, 10);
  }

  get MAX(): number {
    return parseInt(process.env.REDIS_MAX_RESPONSES, 10);
  }

  get DB_INDEX(): number {
    return parseInt(process.env.REDIS_DB_INDEX, 10);
  }
}
