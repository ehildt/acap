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
    return await this.contentsModel.count();
  }

  async countSchemas() {
    return await this.schemaModel.count();
  }

  async find(filter: FILTER, propertiesToSelect?: Array<string>) {
    const { skip, take, search, verbose } = filter;
    if (!verbose) propertiesToSelect.push('value');
    const realms = (
      await this.schemaModel
        .find({}, null, { limit: take, skip })
        .sort({ realm: 'descending', updatedAt: 'descending' })
        .where({ realm: { $text: search } })
        .lean()
    ).map(({ realm }) => realm);
    return await this.contentsModel
      .find()
      .sort({ realm: 'descending', updatedAt: 'descending' })
      .select(propertiesToSelect)
      .where({ realm: { $in: realms, $text: search } })
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
    const isNotEmpty = Boolean(await this.contentsModel.count().where({ realm }));

    if (!isNotEmpty) {
      const realms = prepareBulkWriteDeleteRealms([realm]);
      await this.schemaModel.bulkWrite(realms);
    }

    return rowsDeleted;
  }
}
