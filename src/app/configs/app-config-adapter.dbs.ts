export class AppConfigAdapter {
  constructor(private copy?: AppConfigAdapter) {}

  get NODE_ENV(): string {
    return this.copy?.NODE_ENV ?? process.env.NODE_ENV;
  }

  get PORT(): string {
    return this.copy?.PORT ?? process.env.PORT;
  }

  get HOST(): string {
    return this.copy?.HOST ?? process.env.HOST;
  }

  get HTTP_PROTOCOL(): string {
    return this.copy?.HTTP_PROTOCOL ?? process.env.HTTP_PROTOCOL;
  }

  get START_SWAGGER(): boolean {
    return this.copy?.START_SWAGGER ?? process.env.START_SWAGGER == 'true';
  }

  get PRINT_ENV(): boolean {
    return this.copy?.PRINT_ENV ?? process.env.PRINT_ENV == 'true';
  }
}
