export class AppConfigAdapter {
  constructor(private copy?: AppConfigAdapter) {}

  get PORT(): number {
    return this.copy?.PORT ?? parseInt(process.env.PORT, 10);
  }

  get START_SWAGGER(): boolean {
    return this.copy?.START_SWAGGER ?? process.env.START_SWAGGER == 'true';
  }
}
