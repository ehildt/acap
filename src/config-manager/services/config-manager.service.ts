import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigManagerUpsertReq } from '../dtos/config-manager-upsert-req.dto';
import { ConfigManagerRepository } from './config-manager.repository';
import { reduceConfigRes } from './helpers/reduce-config-res.helper';

@Injectable()
export class ConfigManagerService {
  constructor(private readonly configRepo: ConfigManagerRepository) {}

  async upsert(serviceId: string, req: ConfigManagerUpsertReq[]) {
    return this.configRepo.upsert(serviceId, req);
  }

  async getByServiceId(serviceId: string) {
    const entities = await this.configRepo.where({ serviceId });
    return entities ?? [];
  }

  async getByServiceIdConfigIds(serviceId: string, ids: string[]) {
    const entities = await this.configRepo.where({
      serviceId,
      configId: { $in: ids },
    });

    if (entities?.length < ids?.length)
      throw new UnprocessableEntityException(
        `N/A [ serviceId: ${serviceId} | configId: ${ids.filter(
          (id) => !entities.find(({ configId }) => configId === id),
        )} ]`,
      );

    return reduceConfigRes(entities);
  }

  async deleteByServiceId(serviceId: string) {
    return this.configRepo.delete(serviceId);
  }

  async deleteByServiceIdConfigId(serviceId: string, configIds?: string[]) {
    return this.configRepo.delete(serviceId, configIds);
  }
}
