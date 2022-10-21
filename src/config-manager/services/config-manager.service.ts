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

  async upsert(namespace: string, req: ConfigManagerUpsertReq[]) {
    const entity = await this.configRepo.upsert(namespace, req);
    const configIds = req.map(({ configId }) => configId);
    if (entity) this.client.emit(namespace, configIds);
    return entity;
  }

  async getByNamespace(namespace: string) {
    const entities = await this.configRepo.where({ namespace });
    return entities ?? [];
  }

  async getByNamespaceConfigIds(namespace: string, ids: string[]) {
    const entities = await this.configRepo.where({
      namespace,
      configId: { $in: ids },
    });

    if (entities?.length < ids?.length)
      throw new UnprocessableEntityException(
        `N/A [ namespace: ${namespace} | configId: ${ids.filter(
          (id) => !entities.find(({ configId }) => configId === id),
        )} ]`,
      );

    return reduceConfigRes(entities);
  }

  async deleteByNamespace(namespace: string) {
    const entity = await this.configRepo.delete(namespace);
    if (entity) this.client.emit(namespace, []);
    return entity;
  }

  async deleteByNamespaceConfigId(namespace: string, configIds?: string[]) {
    const entity = await this.configRepo.delete(namespace, configIds);
    if (entity) this.client.emit(namespace, configIds);
    return entity;
  }
}
