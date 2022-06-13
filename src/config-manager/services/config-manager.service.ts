import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigManagerUpsertReq } from '../dtos/config-manager-upsert-req.dto';
import { ConfigManagerRepository } from './config-manager.repository';
import { reduceConfigRes } from './helpers/reduce-config-res.helper';

const NO_CONTENT = 'NoContent';

@Injectable()
export class ConfigManagerService {
  constructor(private readonly configRepo: ConfigManagerRepository) {}

  async upsert(serviceId: string, req: ConfigManagerUpsertReq[]) {
    return this.configRepo.upsert(serviceId, req);
  }

  async getByServiceId(serviceId: string) {
    const entities = await this.configRepo.where({ serviceId });
    if (entities?.length) return entities;
    throw new HttpException(NO_CONTENT, HttpStatus.NO_CONTENT);
  }

  async getByServiceIdConfigIds(serviceId: string, configIds: string[]) {
    const entities = await this.configRepo.where({
      serviceId,
      configId: { $in: configIds },
    });

    return reduceConfigRes(entities);
  }

  async deleteByServiceId(serviceId: string) {
    return this.configRepo.delete(serviceId);
  }

  async deleteByServiceIdConfigId(serviceId: string, configIds?: string[]) {
    return this.configRepo.delete(serviceId, configIds);
  }
}
