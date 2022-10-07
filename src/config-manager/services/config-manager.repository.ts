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

  upsert(serviceId: string, req: ConfigManagerUpsertReq[]) {
    const rowsToUpsert = prepareBulkWriteUpsert(req, serviceId);
    return this.configModel.bulkWrite(rowsToUpsert);
  }

  where(filter: FilterQuery<ConfigManagerGetReq>) {
    return this.configModel.where(filter);
  }

  delete(serviceId: string, req?: string[]) {
    const rowsToDelete = prepareBulkWriteDelete(serviceId, req);
    return this.configModel.bulkWrite(rowsToDelete);
  }
}
