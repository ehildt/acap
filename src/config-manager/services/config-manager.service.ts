import { Injectable } from '@nestjs/common';
import { ConfigManagerUpsertReq } from '../dtos/config-manager-upsert-req.dto';
import { ConfigManagerRepository } from './config-manager.repository';
import { mapConfigRes } from './helpers/map-config-res.helper';
import { reduceConfigRes } from './helpers/reduce-config-res.helper';

@Injectable()
export class ConfigManagerService {
  constructor(private readonly configRepo: ConfigManagerRepository) {}

  async upsert(namespace: string, req: ConfigManagerUpsertReq[]) {
    return this.configRepo.upsert(namespace, req);
  }

  async getByServiceId(namespace: string) {
    const entities = await this.configRepo.where({ namespace });
    return mapConfigRes(entities);
  }

  async getByServiceIdConfigIds(namespace: string, configIds: string[]) {
    const entities = await this.configRepo.where({
      namespace,
      configId: { $in: configIds },
    });

    return reduceConfigRes(entities);
  }

  async deleteByServiceId(namespace: string) {
    return this.configRepo.delete(namespace);
  }

  async deleteByServiceIdConfigId(namespace: string, configIds?: string[]) {
    return this.configRepo.delete(namespace, configIds);
  }
}
