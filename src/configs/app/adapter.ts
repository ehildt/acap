import ShortUniqueId from 'short-unique-id';

const uuid = new ShortUniqueId();

export class AppConfigAdapter {
  get PORT(): number {
    return parseInt(process.env.PORT, 10);
  }

  get ADDRESS(): string {
    return process.env.ADDRESS;
  }

  get START_SWAGGER(): boolean {
    return process.env.START_SWAGGER == 'true';
  }

  get PRINT_ENV(): boolean {
    return process.env.PRINT_ENV == 'true';
  }

  get NODE_ENV(): string {
    return process.env.NODE_ENV;
  }

  get USE_REDIS_PUBSUB(): boolean {
    return process.env.USE_REDIS_PUBSUB === 'true';
  }

  get USE_BULLMQ(): boolean {
    return process.env.USE_BULLMQ === 'true';
  }

  get USE_MQTT(): boolean {
    return process.env.USE_MQTT === 'true';
  }

  get NAMESPACE_POSTFIX(): string {
    return process.env.REALM_NAMESPACE_POSTFIX ?? uuid.randomUUID(32);
  }

  get TTL(): number {
    return parseInt(process.env.REALM_TTL ?? '360', 10);
  }

  get RESOLVE_ENV(): boolean {
    return process.env.REALM_RESOLVE_ENV === 'true';
  }

  get GZIP_THRESHOLD(): number {
    return parseInt(process.env.REALM_GZIP_THRESHOLD ?? '20', 10);
  }

  get SYMMETRIC_KEY(): string {
    return process.env.SYMMETRIC_KEY;
  }

  get SYMMETRIC_ALGORITHM(): string {
    return process.env.SYMMETRIC_ALGORITHM;
  }
}
