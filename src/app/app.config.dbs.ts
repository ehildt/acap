import { ConfigService, registerAs } from '@nestjs/config';

class AppConfigAdapter {
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

  get SWAGGER_AUTO_START(): boolean {
    return (
      this.copy?.SWAGGER_AUTO_START ?? process.env.SWAGGER_AUTO_START == 'true'
    );
  }
}

export const AppConfig = registerAs(
  'AppConfig',
  async () => new AppConfigAdapter(),
);

export function appConfigFactory(config: ConfigService) {
  return {
    nodeEnv: config.get<string>('AppConfig.NODE_ENV'),
    port: config.get<string>('AppConfig.PORT'),
    host: config.get<string>('AppConfig.HOST'),
    swaggerAutoStart: config.get<boolean>('AppConfig.SWAGGER_AUTO_START'),
    httpProtocol: config.get<string>('AppConfig.HTTP_PROTOCOL'),
  };
}
