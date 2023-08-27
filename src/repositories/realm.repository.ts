import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { ContentUpsertReq } from '@/dtos/content-upsert-req.dto';
import { RealmReq } from '@/dtos/realm-req.dto';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { prepareBulkWriteDeleteContents } from '@/helpers/prepare-bulk-write-delete-contents.helper';
import { prepareBulkWriteDeleteRealms } from '@/helpers/prepare-bulk-write-delete-realms.helper';
import { prepareBulkWriteContents } from '@/helpers/prepare-bulk-write-upsert-contents.helper';
import { prepareBulkWriteRealms } from '@/helpers/prepare-bulk-write-upsert-realm.helper';
import { FILTER } from '@/models/filter.model';
import { RealmContentsDocument, RealmContentsSchemaDefinition } from '@/schemas/realm-content-definition.schema';
import { RealmsDocument, RealmsSchemaDefinition } from '@/schemas/realms-schema-definition.schema';

@Injectable()
export class RealmRepository {
  constructor(
    @InjectModel(RealmContentsSchemaDefinition.name)
    private readonly contentModel: Model<RealmContentsDocument>,
    @InjectModel(RealmsSchemaDefinition.name)
    private readonly realmModel: Model<RealmsDocument>,
  ) {}

  async findAll() {
    return await this.contentModel.find().sort({ realm: 'asc', updatedAt: 'asc' }).lean();
  }

  async countContents() {
    return await this.contentModel.count();
  }

  async countRealms() {
    return await this.realmModel.count();
  }

  async getMetaRealmsBySchemas(realms: Array<string>, propertiesToSelect: Array<string>) {
    return await this.contentModel
      .find()
      .where({ realm: { $in: realms } })
      .select(propertiesToSelect)
      .sort({ realm: 'descending', updatedAt: 'descending' })
      .lean();
  }

  async find(filter: FILTER, propertiesToSelect?: Array<string>) {
    const { skip, take, search, verbose } = filter;
    if (search) {
      return await this.contentModel
        .find(null, null, { limit: take, skip })
        .where({
          $or: [
            { realm: { $regex: `.*${search}.*`, $options: 'i' } },
            { value: { $regex: `.*${search}.*`, $options: 'i' } },
            { id: { $regex: `.*${search}.*`, $options: 'i' } },
          ],
        })
        .select(verbose ? propertiesToSelect?.concat(['value']) : propertiesToSelect)
        .sort({ realm: 'descending', updatedAt: 'descending' })
        .lean();
    }

    const realms = (
      await this.realmModel
        .find(null, null, { limit: take, skip })
        .sort({ realm: 'descending', updatedAt: 'descending' })
        .lean()
    ).map(({ realm }) => realm);

    return await this.contentModel
      .where({ realm: { $in: realms } })
      .select(verbose ? propertiesToSelect?.concat(['value']) : propertiesToSelect)
      .sort({ realm: 'descending', updatedAt: 'descending' })
      .lean();
  }

  async where(filter: FilterQuery<RealmReq>) {
    return await this.contentModel.where(filter).lean();
  }

  async upsertMany(reqs: RealmsUpsertReq[]) {
    const realms = prepareBulkWriteRealms(reqs.map(({ realm }) => realm));
    await this.realmModel.bulkWrite(realms);
    const preparedUpserts = reqs.map((req) => prepareBulkWriteContents(req.contents, req.realm)).flat();
    return await this.contentModel.bulkWrite(preparedUpserts);
  }

  async upsert(realm: string, req: ContentUpsertReq[]) {
    const realms = prepareBulkWriteRealms([realm]);
    await this.realmModel.bulkWrite(realms);
    const rowsToUpsert = prepareBulkWriteContents(req, realm);
    return await this.contentModel.bulkWrite(rowsToUpsert);
  }

  async delete(realm: string, req?: string[]) {
    const rowsToDelete = prepareBulkWriteDeleteContents(realm, req);
    const rowsDeleted = await this.contentModel.bulkWrite(rowsToDelete);
    const isNotEmpty = Boolean(await this.contentModel.count().where({ realm }));

    if (!isNotEmpty) {
      const realms = prepareBulkWriteDeleteRealms([realm]);
      await this.realmModel.bulkWrite(realms);
    }

    return rowsDeleted;
  }
}
