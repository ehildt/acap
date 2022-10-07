export class ConfigPublisherAdapter {
  constructor(private copy?: ConfigPublisherAdapter) {}

  get PORT(): number {
    return this.copy?.PORT ?? parseInt(process.env.PUBLISHER_REDIS_PORT, 10);
  }

  get HOST(): string {
    return this.copy?.HOST ?? process.env.PUBLISHER_REDIS_HOST;
  }
}
