import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthManagerConfig,
  authManagerConfigFactory,
} from '../configs/auth-manager/auth-manager-config-factory.dbs';

@Injectable()
export class ConfigManagerApi {
  #config: AuthManagerConfig;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private get config() {
    if (this.#config) return this.#config;
    return (this.#config = authManagerConfigFactory(this.configService));
  }

  async getConfigIds(
    refServiceId: string,
    refConfigIds: string[],
  ): Promise<Record<string, any>> {
    return (
      await firstValueFrom(
        this.httpService.get(
          `api/v1/configs/services/${refServiceId}/configs/${refConfigIds}`,
          {
            baseURL: this.config.configManagerBaseUrl,
            headers: {
              Authorization: `Bearer ${this.config.consumerToken}`,
            },
          },
        ),
      )
    )?.data;
  }

  async getServiceId(refServiceId: string): Promise<Record<string, any>> {
    return (
      await firstValueFrom(
        this.httpService.get(`api/v1/configs/services/${refServiceId}`, {
          baseURL: this.config.configManagerBaseUrl,
          headers: {
            Authorization: `Bearer ${this.config.consumerToken}`,
          },
        }),
      )
    )?.data;
  }
}
