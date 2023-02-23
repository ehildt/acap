export class ConfigPublisherAdapter {
  get PORT(): number {
    return parseInt(process.env.REDIS_PUBLISHER_PORT, 10);
  }

  get HOST(): string {
    return process.env.REDIS_PUBLISHER_HOST;
  }

  get EVENTS(): boolean {
    return process.env.REDIS_PUBLISHER_PUBLISH_EVENTS === 'true';
  }

  get PASS(): string {
    return process.env.REDIS_PUBLISHER_PASS;
  }

  get USER(): string {
    return process.env.REDIS_PUBLISHER_USER;
  }
}
