import { ContentUpsertReq } from '@/dtos/content-upsert-req.dto';

export function prepareBulkWriteContents(req: Array<ContentUpsertReq>, realm: string) {
  return req.map(({ id, value }) => ({
    updateOne: {
      upsert: true,
      filter: { id, realm },
      update: {
        value: typeof value === 'object' ? JSON.stringify(value) : value,
      },
    },
  }));
}
