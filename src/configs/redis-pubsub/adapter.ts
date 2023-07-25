export class RedisPubSubAdapter {
  get PORT(): number {
    return parseInt(process.env.REDIS_PUBSUB_PORT, 10);
  }

  get HOST(): string {
    return process.env.REDIS_PUBSUB_HOST;
  }

  get PASS(): string {
    return process.env.REDIS_PUBSUB_PASS;
  }

  get USER(): string {
    return process.env.REDIS_PUBSUB_USER;
  }
}
