export class AppConfigAdapter {
  constructor(private copy?: AppConfigAdapter) {}

  get PORT(): string {
    return this.copy?.PORT ?? process.env.PORT;
  }

  get START_SWAGGER(): boolean {
    return this.copy?.START_SWAGGER ?? process.env.START_SWAGGER == 'true';
  }
}
