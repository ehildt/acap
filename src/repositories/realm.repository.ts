import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { RealmReq } from '@/dtos/realm-req.dto';
import { RealmUpsertReq } from '@/dtos/realm-upsert-req.dto';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { prepareBulkWriteDeleteConfigs } from '@/helpers/prepare-bulk-write-delete-configs.helper';
import { prepareBulkWriteDeleteRealms } from '@/helpers/prepare-bulk-write-delete-realms.helper';
import { prepareBulkWriteConfigs } from '@/helpers/prepare-bulk-write-upsert-configs.helper';
import { prepareBulkWriteRealms } from '@/helpers/prepare-bulk-write-upsert-realm.helper';
import { RealmConfigsDocument, RealmConfigsSchemaDefinition } from '@/schemas/realm-configs-definition.schema';
import { RealmsDocument, RealmsSchemaDefinition } from '@/schemas/realms-schema-definition.schema';

@Injectable()
export class RealmRepository {
  constructor(
    @InjectModel(RealmConfigsSchemaDefinition.name)
    private readonly configModel: Model<RealmConfigsDocument>,
    @InjectModel(RealmsSchemaDefinition.name)
    private readonly realmModel: Model<RealmsDocument>,
  ) {}

  async findAll() {
    return await this.configModel.find().sort({ realm: 'desc', updatedAt: 'desc' }).lean();
  }

  async getMeta(take: number, skip: number, propertiesToSelect: Array<string>) {
    return await this.configModel
      .find({}, null, { limit: take, skip })
      .select(propertiesToSelect)
      .sort({ realm: 'desc', updatedAt: 'desc' })
      .lean();
  }

  async getMetaRealmsBySchemas(realms: Array<string>, propertiesToSelect: Array<string>) {
    return await this.configModel
      .find()
      .where({ realm: { $in: realms } })
      .select(propertiesToSelect)
      .sort({ realm: 'desc', updatedAt: 'desc' })
      .lean();
  }

  async find(take: number, skip: number) {
    const realms = (await this.realmModel.find({}, null, { limit: take, skip }).lean()).map(({ realm }) => realm);
    return await this.configModel
      .where({ realm: { $in: realms } })
      .sort({ realm: 'desc', updatedAt: 'desc' })
      .lean();
  }

  async where(filter: FilterQuery<RealmReq>) {
    return await this.configModel.where(filter).lean();
  }

  async upsertMany(reqs: RealmsUpsertReq[]) {
    const realms = prepareBulkWriteRealms(reqs.map(({ realm }) => realm));
    await this.realmModel.bulkWrite(realms);
    const preparedUpserts = reqs.map((req) => prepareBulkWriteConfigs(req.configs, req.realm)).flat();
    return await this.configModel.bulkWrite(preparedUpserts);
  }

  async upsert(realm: string, req: RealmUpsertReq[]) {
    const realms = prepareBulkWriteRealms([realm]);
    await this.realmModel.bulkWrite(realms);
    const rowsToUpsert = prepareBulkWriteConfigs(req, realm);
    return await this.configModel.bulkWrite(rowsToUpsert);
  }

  async delete(realm: string, req?: string[]) {
    const rowsToDelete = prepareBulkWriteDeleteConfigs(realm, req);
    const rowsDeleted = await this.configModel.bulkWrite(rowsToDelete);
    const isNotEmpty = Boolean(await this.configModel.count().where({ realm }));

    if (!isNotEmpty) {
      const realms = prepareBulkWriteDeleteRealms([realm]);
      await this.realmModel.bulkWrite(realms);
    }

    return rowsDeleted;
  }
}
