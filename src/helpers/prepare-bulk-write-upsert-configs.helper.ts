import { RealmUpsertReq } from '@/dtos/realm-upsert-req.dto';
import { SchemaUpsertReq } from '@/dtos/schema-upsert-req.dto';

export function prepareBulkWriteConfigs(req: RealmUpsertReq[] | SchemaUpsertReq[], realm: string) {
  return req.map((config) => ({
    updateOne: {
      upsert: true,
      filter: { id: config.id, realm },
      update: {
        value: typeof config.value === 'string' ? config.value : JSON.stringify(config.value),
      },
    },
  }));
}
