import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { ContentUpsertReq } from '@/dtos/content-upsert-req.dto';
import { RealmReq } from '@/dtos/realm-req.dto';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { prepareBulkWriteContents } from '@/helpers/prepare-bulk-write-contents.helper';
import { prepareBulkWriteDeleteContents } from '@/helpers/prepare-bulk-write-delete-contents.helper';
import { prepareBulkWriteDeleteRealms } from '@/helpers/prepare-bulk-write-delete-realms.helper';
import { prepareBulkWriteRealms } from '@/helpers/prepare-bulk-write-realms.helper';
import { FILTER } from '@/models/filter.model';
import {
  JsonSchemaContentsDefinition,
  JsonSchemaContentsDocument,
} from '@/schemas/json-schema-content-definition.schema';
import { JsonSchemaDefinition, JsonSchemaDocument } from '@/schemas/json-schema-definition.schema';

@Injectable()
export class SchemaRepository {
  constructor(
    @InjectModel(JsonSchemaContentsDefinition.name)
    private readonly contentsModel: Model<JsonSchemaContentsDocument>,
    @InjectModel(JsonSchemaDefinition.name)
    private readonly schemaModel: Model<JsonSchemaDocument>,
  ) {}

  async countContents() {
    return await this.contentsModel.estimatedDocumentCount();
  }

  async countSchemas() {
    return await this.schemaModel.estimatedDocumentCount();
  }

  async find(filter: FILTER, propertiesToSelect?: Array<string>) {
    const { skip, take, search, verbose } = filter;
    const selectProperties = verbose ? propertiesToSelect.concat(['value']) : propertiesToSelect;

    if (search) {
      return await this.contentsModel
        .find(null, null, { limit: take, skip })
        .where({
          $or: [
            { realm: { $regex: `.*${search}.*`, $options: 'i' } },
            { value: { $regex: `.*${search}.*`, $options: 'i' } },
            { id: { $regex: `.*${search}.*`, $options: 'i' } },
          ],
        })
        .select(selectProperties)
        .sort({ realm: 'descending', updatedAt: 'descending' })
        .lean();
    }

    const realms = (
      await this.schemaModel
        .find({}, null, { limit: take, skip })
        .sort({ realm: 'descending', updatedAt: 'descending' })
        .lean()
    ).map(({ realm }) => realm);

    return await this.contentsModel
      .where({ realm: { $in: realms } })
      .select(selectProperties)
      .sort({ realm: 'descending', updatedAt: 'descending' })
      .lean();
  }

  async findAll() {
    return await this.contentsModel.find().sort({ realm: 'asc', updatedAt: 'asc' }).lean();
  }

  async getMetaSchemasByRealms(realms: Array<string>, propertiesToSelect: Array<string>) {
    return await this.contentsModel
      .find()
      .where({ realm: { $in: realms } })
      .select(propertiesToSelect)
      .sort({ realm: 'asc', updatedAt: 'asc' })
      .lean();
  }

  async where(filter: FilterQuery<RealmReq>) {
    return await this.contentsModel.find().where(filter).lean();
  }

  async upsert(realm: string, req: ContentUpsertReq[]) {
    const realms = prepareBulkWriteRealms([realm]);
    await this.schemaModel.bulkWrite(realms);
    const rowsToUpsert = prepareBulkWriteContents(req, realm);
    return await this.contentsModel.bulkWrite(rowsToUpsert);
  }

  async upsertMany(reqs: RealmsUpsertReq[]) {
    const realms = prepareBulkWriteRealms(reqs.map(({ realm }) => realm));
    await this.schemaModel.bulkWrite(realms);
    const preparedUpserts = reqs.map((req) => prepareBulkWriteContents(req.contents, req.realm)).flat();
    return await this.contentsModel.bulkWrite(preparedUpserts);
  }

  async delete(realm: string, req?: string[]) {
    const rowsToDelete = prepareBulkWriteDeleteContents(realm, req);
    const rowsDeleted = await this.contentsModel.bulkWrite(rowsToDelete);
    const isNotEmpty = Boolean(await this.contentsModel.estimatedDocumentCount().where({ realm }));

    if (!isNotEmpty) {
      const realms = prepareBulkWriteDeleteRealms([realm]);
      await this.schemaModel.bulkWrite(realms);
    }

    return rowsDeleted;
  }
}
