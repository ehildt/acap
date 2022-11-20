import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigManagerGetReq } from '../dtos/config-manager-get-req.dto';
import { ConfigManagerUpsertNamespaceReq } from '../dtos/config-manager-upsert-by-namespace.dto.req';
import { ConfigManagerUpsertReq } from '../dtos/config-manager-upsert-req.dto';
import { ConfigManagerConfigs, ConfigManagerConfigsDocument } from '../schemas/configs.schema';
import { ConfigManagerNamespaces, ConfigManagerNamespacesDocument } from '../schemas/namespaces.schema';
import { prepareBulkWriteDeleteConfigs } from './helpers/prepare-bulk-write-delete-configs.helper';
import { prepareBulkWriteDeleteNamespaces } from './helpers/prepare-bulk-write-delete-namespaces.helper';
import { prepareBulkWriteConfigs } from './helpers/prepare-bulk-write-upsert-configs.helper';
import { prepareBulkWriteNamespaces } from './helpers/prepare-bulk-write-upsert-namespace.helper';

@Injectable()
export class ConfigManagerRepository {
  constructor(
    @InjectModel(ConfigManagerConfigs.name)
    private readonly configsModel: Model<ConfigManagerConfigsDocument>,
    @InjectModel(ConfigManagerNamespaces.name)
    private readonly namespaceModel: Model<ConfigManagerNamespacesDocument>,
  ) {}

  async find(take: number, skip: number) {
    const namespaces = (await this.namespaceModel.find({}, null, { limit: take, skip }).lean()).map(
      ({ namespace }) => namespace,
    );
    return await this.configsModel
      .where({ namespace: { $in: namespaces } })
      .sort({ namespace: 'desc', updatedAt: 'desc' })
      .lean();
  }

  async where(filter: FilterQuery<ConfigManagerGetReq>) {
    return await this.configsModel.where(filter).lean();
  }

  async upsertMany(reqs: ConfigManagerUpsertNamespaceReq[]) {
    const namespaces = prepareBulkWriteNamespaces(reqs.map(({ namespace }) => namespace));
    await this.namespaceModel.bulkWrite(namespaces);
    const preparedUpserts = reqs.map((req) => prepareBulkWriteConfigs(req.configs, req.namespace)).flat();
    return await this.configsModel.bulkWrite(preparedUpserts);
  }

  async upsert(namespace: string, req: ConfigManagerUpsertReq[]) {
    const namespaces = prepareBulkWriteNamespaces([namespace]);
    await this.namespaceModel.bulkWrite(namespaces);
    const rowsToUpsert = prepareBulkWriteConfigs(req, namespace);
    return await this.configsModel.bulkWrite(rowsToUpsert);
  }

  async delete(namespace: string, req?: string[]) {
    const namespaces = prepareBulkWriteDeleteNamespaces([namespace]);
    await this.namespaceModel.bulkWrite(namespaces);
    const rowsToDelete = prepareBulkWriteDeleteConfigs(namespace, req);
    return await this.configsModel.bulkWrite(rowsToDelete);
  }
}
