import { AppConfig } from '@/config.yml.modal';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigFactoryService {
  #appConfig: AppConfig;

  constructor(private readonly configService: ConfigService) {}

  get app() {
    if (this.#appConfig) return this.#appConfig;
    return (this.#appConfig = Object.freeze({
      port: this.configService.get<number>('AppConfig.PORT'),
      startSwagger: this.configService.get<boolean>('AppConfig.START_SWAGGER'),
      printEnv: this.configService.get<boolean>('AppConfig.PRINT_ENV'),
    }));
  }
}
