export class ConfigPublisherAdapter {
  get PORT(): number {
    return parseInt(process.env.REDIS_PUBLISHER_PORT, 10);
  }

  get HOST(): string {
    return process.env.REDIS_PUBLISHER_HOST;
  }

  get PUBLISH_EVENTS(): boolean {
    return process.env.REDIS_PUBLISHER_PUBLISH_EVENTS === 'true';
  }
}
