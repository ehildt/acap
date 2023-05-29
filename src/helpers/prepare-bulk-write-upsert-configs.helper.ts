import { RealmUpsertReq } from '@/dtos/realm-upsert-req.dto';

export function prepareBulkWriteConfigs(req: RealmUpsertReq[], realm: string) {
  return req.map((config) => ({
    updateOne: {
      upsert: true,
      filter: { configId: config.configId, realm },
      update: {
        value: typeof config.value === 'string' ? config.value : JSON.stringify(config.value),
      },
    },
  }));
}
