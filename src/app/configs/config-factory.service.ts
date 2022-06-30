import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config-factory.modal';

@Injectable()
export class ConfigFactoryService {
  #appConfig: AppConfig;

  constructor(private readonly configService: ConfigService) {}

  get app() {
    if (this.#appConfig) return this.#appConfig;
    return (this.#appConfig = <AppConfig>{
      port: this.configService.get<string>('AppConfig.PORT'),
      startSwagger: this.configService.get<boolean>('AppConfig.START_SWAGGER'),
    });
  }
}
