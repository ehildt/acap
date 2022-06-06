import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    const entities = await this.configRepo.find({ serviceId });
    if (!entities?.length)
      throw new HttpException('NoContent', HttpStatus.NO_CONTENT);
    return mapConfigRes(entities);
  }

  async getByServiceIdConfigId(serviceId: string, configId: string) {
    const entity = await this.configRepo.findOne({ serviceId, configId });
    if (!entity) throw new HttpException('NoContent', HttpStatus.NO_CONTENT);
    return mapConfigRes(entity);
  }

  async deleteByServiceId(serviceId: string) {
    return this.configRepo.delete(serviceId);
  }

  async deleteByConfigId(serviceId: string, configIds?: string[]) {
    return this.configRepo.delete(serviceId, configIds);
  }
}
