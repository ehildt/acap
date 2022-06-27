import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigFactoryService } from '../configs/config-factory.service';

@Injectable()
export class ConfigManagerApi {
  constructor(
    private readonly httpService: HttpService,
    private readonly configFactory: ConfigFactoryService,
  ) {}

  async getConfigIds(
    refServiceId: string,
    refConfigIds: string[],
  ): Promise<Record<string, any>> {
    const config = this.configFactory.authManager;
    return (
      await firstValueFrom(
        this.httpService.get(
          `api/v1/configs/services/${refServiceId}/configs/${refConfigIds}`,
          {
            baseURL: config.configManagerBaseUrl,
            headers: {
              Authorization: `Bearer ${config.consumerToken}`,
            },
          },
        ),
      )
    )?.data;
  }

  async getServiceId(refServiceId: string): Promise<Record<string, any>> {
    const config = this.configFactory.authManager;
    return (
      await firstValueFrom(
        this.httpService.get(`api/v1/configs/services/${refServiceId}`, {
          baseURL: config.configManagerBaseUrl,
          headers: {
            Authorization: `Bearer ${config.consumerToken}`,
          },
        }),
      )
    )?.data;
  }
}
