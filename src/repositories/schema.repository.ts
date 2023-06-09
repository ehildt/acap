import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { RealmReq } from '@/dtos/realm-req.dto';
import { RealmUpsertReq } from '@/dtos/realm-upsert-req.dto';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
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

  async find(take: number, skip: number) {
    const realms = (await this.schemaModel.find({}, null, { limit: take, skip }).lean()).map(({ realm }) => realm);
    return await this.configsModel
      .where({ realm: { $in: realms } })
      .sort({ realm: 'desc', updatedAt: 'desc' })
      .lean();
  }

  async where(filter: FilterQuery<RealmReq>) {
    return await this.configsModel.find().where(filter).lean();
  }

  async upsert(realm: string, req: RealmUpsertReq[]) {
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
}
