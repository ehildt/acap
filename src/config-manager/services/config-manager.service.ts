import { Injectable } from '@nestjs/common';
import { ConfigManagerUpsertReq } from '../dtos/config-manager-upsert-req.dto';
import { ConfigManagerRepository } from './config-manager.repository';
import { mapConfigRes } from './helpers/map-config-res.helper';

@Injectable()
export class ConfigManagerService {
  constructor(private readonly configRepo: ConfigManagerRepository) {}

  async upsert(serviceId: string, req: ConfigManagerUpsertReq[]) {
    return this.configRepo.upsert(serviceId, req);
  }

  async getByServiceId(serviceId: string) {
    const entities = await this.configRepo.where({ serviceId });
    return mapConfigRes(entities);
  }

  async getByServiceIdConfigIds(serviceId: string, configIds: string[]) {
    const entities = await this.configRepo.where({
      serviceId,
      configId: { $in: configIds },
    });

    return mapConfigRes(entities);
  }

  async deleteByServiceId(serviceId: string) {
    return this.configRepo.delete(serviceId);
  }

  async deleteByConfigId(serviceId: string, configIds?: string[]) {
    return this.configRepo.delete(serviceId, configIds);
  }
}
