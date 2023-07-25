import { ContentUpsertReq } from '@/dtos/content-upsert-req.dto';

export function prepareBulkWriteConfigs(req: Array<ContentUpsertReq>, realm: string) {
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
