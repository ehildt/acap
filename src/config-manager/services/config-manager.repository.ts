import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigManagerGetReq } from '../dtos/config-manager-get-req.dto';
import { ConfigManagerUpsertReq } from '../dtos/config-manager-upsert-req.dto';
import { ConfigManager, ConfigManagerDocument } from '../schemas/config-manager.schema';
import { prepareBulkWriteDelete } from './helpers/prepare-bulk-write-delete.helper';
import { prepareBulkWriteUpsert } from './helpers/prepare-bulk-write-upsert.helper';

@Injectable()
export class ConfigManagerRepository {
  constructor(
    @InjectModel(ConfigManager.name)
    private readonly configModel: Model<ConfigManagerDocument>,
  ) {}

  async find(take: number, skip: number) {
    return await this.configModel.find({}, null, { limit: take, skip }).lean();
  }

  async upsert(namespace: string, req: ConfigManagerUpsertReq[]) {
    const rowsToUpsert = prepareBulkWriteUpsert(req, namespace);
    return await this.configModel.bulkWrite(rowsToUpsert);
  }

  async where(filter: FilterQuery<ConfigManagerGetReq>) {
    return await this.configModel.where(filter).lean();
  }

  async delete(namespace: string, req?: string[]) {
    const rowsToDelete = prepareBulkWriteDelete(namespace, req);
    return await this.configModel.bulkWrite(rowsToDelete);
  }
}
