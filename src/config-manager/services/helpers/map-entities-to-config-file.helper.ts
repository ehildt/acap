import { LeanDocument } from 'mongoose';
import { ConfigManagerConfigs } from '@/config-manager/schemas/configs.schema';

export function mapEntitiesToConfigFile(entities: LeanDocument<ConfigManagerConfigs>[], namespaces?: string[]) {
  return namespaces?.map((namespace) => ({
    namespace,
    configs: entities
      .filter((entity) => entity.namespace === namespace)
      .map((config) => ({ configId: config.configId, value: config.value })),
  }));
}
