import { ConfigService } from '@nestjs/config';

export function appConfigFactory(config: ConfigService) {
  return {
    nodeEnv: config.get<string>('AppConfig.NODE_ENV'),
    port: config.get<string>('AppConfig.PORT'),
    host: config.get<string>('AppConfig.HOST'),
    swaggerAutoStart: config.get<boolean>('AppConfig.SWAGGER_AUTO_START'),
    httpProtocol: config.get<string>('AppConfig.HTTP_PROTOCOL'),
  };
}
