import { ConfigService } from '@nestjs/config';

export function appConfigFactory(config: ConfigService) {
  return {
    nodeEnv: config.get<string>('AppConfig.NODE_ENV'),
    port: config.get<string>('AppConfig.PORT'),
    host: config.get<string>('AppConfig.HOST'),
    swaggerStart: config.get<boolean>('AppConfig.START_SWAGGER'),
    httpProtocol: config.get<string>('AppConfig.HTTP_PROTOCOL'),
    printEnv: config.get<boolean>('AppConfig.PRINT_ENV'),
  };
}
