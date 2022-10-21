import { ConfigManagerUpsertReq } from '@/config-manager/dtos/config-manager-upsert-req.dto';

export function prepareBulkWriteUpsert(req: ConfigManagerUpsertReq[], namespace: string) {
  return req.map((config) => ({
    updateOne: {
      upsert: true,
      filter: { configId: config.configId },
      update: {
        value: typeof config.value === 'string' ? config.value : JSON.stringify(config.value),
        namespace,
      },
    },
  }));
}
