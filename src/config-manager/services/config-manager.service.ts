import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Publisher } from '../constants/publisher.enum';
import { ConfigManagerUpsertReq } from '../dtos/config-manager-upsert-req.dto';
import { ConfigManagerRepository } from './config-manager.repository';
import { reduceConfigRes } from './helpers/reduce-config-res.helper';

const { TOKEN } = Publisher;

@Injectable()
export class ConfigManagerService {
  constructor(private readonly configRepo: ConfigManagerRepository, @Inject(TOKEN) private client: ClientProxy) {}

  async upsert(serviceId: string, req: ConfigManagerUpsertReq[]) {
    const entity = await this.configRepo.upsert(serviceId, req);
    const configIds = req.map(({ configId }) => configId);
    if (entity) this.client.emit(serviceId, configIds);
    return entity;
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
    const entity = await this.configRepo.delete(serviceId);
    if (entity) this.client.emit(serviceId, []);
    return entity;
  }

  async deleteByServiceIdConfigId(serviceId: string, configIds?: string[]) {
    const entity = await this.configRepo.delete(serviceId, configIds);
    if (entity) this.client.emit(serviceId, configIds);
    return entity;
  }
}
