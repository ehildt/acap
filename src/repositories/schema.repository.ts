import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { ContentUpsertReq } from '@/dtos/content-upsert-req.dto';
import { RealmReq } from '@/dtos/realm-req.dto';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { prepareBulkWriteDeleteConfigs } from '@/helpers/prepare-bulk-write-delete-configs.helper';
import { prepareBulkWriteDeleteRealms } from '@/helpers/prepare-bulk-write-delete-realms.helper';
import { prepareBulkWriteConfigs } from '@/helpers/prepare-bulk-write-upsert-configs.helper';
import { prepareBulkWriteRealms } from '@/helpers/prepare-bulk-write-upsert-realm.helper';
import { JsonSchemaConfigsDefinition, JsonSchemaConfigsDocument } from '@/schemas/json-schema-config-definition.schema';
import { JsonSchemaDefinition, JsonSchemaDocument } from '@/schemas/json-schema-definition.schema';

@Injectable()
export class SchemaRepository {
  constructor(
    @InjectModel(JsonSchemaConfigsDefinition.name)
    private readonly configsModel: Model<JsonSchemaConfigsDocument>,
    @InjectModel(JsonSchemaDefinition.name)
    private readonly schemaModel: Model<JsonSchemaDocument>,
  ) {}

  async find(take: number, skip: number, propertiesToSelect?: Array<string>) {
    const realms = (await this.schemaModel.find({}, null, { limit: take, skip }).lean()).map(({ realm }) => realm);
    return await this.configsModel
      .find()
      .select(propertiesToSelect)
      .where({ realm: { $in: realms } })
      .sort({ realm: 'asc', updatedAt: 'asc' })
      .lean();
  }

  async findAll() {
    return await this.configsModel.find().sort({ realm: 'asc', updatedAt: 'asc' }).lean();
  }

  async getMetaSchemasByRealms(realms: Array<string>, propertiesToSelect: Array<string>) {
    return await this.configsModel
      .find()
      .where({ realm: { $in: realms } })
      .select(propertiesToSelect)
      .sort({ realm: 'asc', updatedAt: 'asc' })
      .lean();
  }

  async where(filter: FilterQuery<RealmReq>) {
    return await this.configsModel.find().where(filter).lean();
  }

  async upsert(realm: string, req: ContentUpsertReq[]) {
    const realms = prepareBulkWriteRealms([realm]);
    await this.schemaModel.bulkWrite(realms);
    const rowsToUpsert = prepareBulkWriteConfigs(req, realm);
    return await this.configsModel.bulkWrite(rowsToUpsert);
  }

  async upsertMany(reqs: RealmsUpsertReq[]) {
    const realms = prepareBulkWriteRealms(reqs.map(({ realm }) => realm));
    await this.schemaModel.bulkWrite(realms);
    const preparedUpserts = reqs.map((req) => prepareBulkWriteConfigs(req.configs, req.realm)).flat();
    return await this.configsModel.bulkWrite(preparedUpserts);
  }

  async delete(realm: string, req?: string[]) {
    const rowsToDelete = prepareBulkWriteDeleteConfigs(realm, req);
    const rowsDeleted = await this.configsModel.bulkWrite(rowsToDelete);
    const isNotEmpty = Boolean(await this.configsModel.count().where({ realm }));

    if (!isNotEmpty) {
      const realms = prepareBulkWriteDeleteRealms([realm]);
      await this.schemaModel.bulkWrite(realms);
    }

    return rowsDeleted;
  }
}
