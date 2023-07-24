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
}
