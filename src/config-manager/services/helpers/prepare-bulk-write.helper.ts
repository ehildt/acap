import { ConfigManagerUpsertReq } from '@/config-manager/dtos/config-manager-upsert-req.dto';
import { challengeStringifyConfigValue } from './challenge-stringify-config-value.helper';

export function prepareBulkWriteUpsert(
  req: ConfigManagerUpsertReq[],
  serviceId: string,
) {
  return req.map((config) => ({
    updateOne: {
      upsert: true,
      filter: { configId: config.configId },
      update: {
        value: challengeStringifyConfigValue(config.value),
        serviceId,
      },
    },
  }));
}
