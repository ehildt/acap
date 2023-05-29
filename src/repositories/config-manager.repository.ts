import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { ConfigManagerGetReq } from '@/dtos/config-manager-get-req.dto';
import { ConfigManagerUpsertRealmReq } from '@/dtos/config-manager-upsert-by-realm.dto.req';
import { ConfigManagerUpsertReq } from '@/dtos/config-manager-upsert-req.dto';
import { prepareBulkWriteDeleteConfigs } from '@/helpers/prepare-bulk-write-delete-configs.helper';
import { prepareBulkWriteDeleteRealms } from '@/helpers/prepare-bulk-write-delete-realms.helper';
import { prepareBulkWriteConfigs } from '@/helpers/prepare-bulk-write-upsert-configs.helper';
import { prepareBulkWriteRealms } from '@/helpers/prepare-bulk-write-upsert-realm.helper';
import { ConfigManagerConfigs, ConfigManagerConfigsDocument } from '@/schemas/configs.schema';
import { ConfigManagerRealms, ConfigManagerRealmsDocument } from '@/schemas/realms.schema';

@Injectable()
export class ConfigManagerRepository {
  constructor(
    @InjectModel(ConfigManagerConfigs.name)
    private readonly configsModel: Model<ConfigManagerConfigsDocument>,
    @InjectModel(ConfigManagerRealms.name)
    private readonly namespaceModel: Model<ConfigManagerRealmsDocument>,
  ) {}

  async findAll() {
    return await this.configsModel.find().sort({ realm: 'desc', updatedAt: 'desc' }).lean();
  }

  async find(take: number, skip: number) {
    const realms = (await this.namespaceModel.find({}, null, { limit: take, skip }).lean()).map(({ realm }) => realm);
    return await this.configsModel
      .where({ realm: { $in: realms } })
      .sort({ realm: 'desc', updatedAt: 'desc' })
      .lean();
  }

  async where(filter: FilterQuery<ConfigManagerGetReq>) {
    return await this.configsModel.where(filter).lean();
  }

  async upsertMany(reqs: ConfigManagerUpsertRealmReq[]) {
    const realms = prepareBulkWriteRealms(reqs.map(({ realm }) => realm));
    await this.namespaceModel.bulkWrite(realms);
    const preparedUpserts = reqs.map((req) => prepareBulkWriteConfigs(req.configs, req.realm)).flat();
    return await this.configsModel.bulkWrite(preparedUpserts);
  }

  async upsert(realm: string, req: ConfigManagerUpsertReq[]) {
    const realms = prepareBulkWriteRealms([realm]);
    await this.namespaceModel.bulkWrite(realms);
    const rowsToUpsert = prepareBulkWriteConfigs(req, realm);
    return await this.configsModel.bulkWrite(rowsToUpsert);
  }

  async delete(realm: string, req?: string[]) {
    const rowsToDelete = prepareBulkWriteDeleteConfigs(realm, req);
    const rowsDeleted = await this.configsModel.bulkWrite(rowsToDelete);
    const isNotEmpty = Boolean(await this.configsModel.count().where({ realm }));
    if (!isNotEmpty) {
      const realms = prepareBulkWriteDeleteRealms([realm]);
      await this.namespaceModel.bulkWrite(realms);
    }

    return rowsDeleted;
  }
}
