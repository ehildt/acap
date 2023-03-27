import { ConfigManagerConfigs } from '@/config-manager/schemas/configs.schema';

export function mapEntitiesToConfigFile(entities: ConfigManagerConfigs[], namespaces?: string[]) {
  return namespaces?.map((namespace) => ({
    namespace,
    configs: entities
      .filter((entity) => entity.namespace === namespace)
      .map((config) => {
        try {
          return { configId: config.configId, value: JSON.parse(config.value) };
        } catch {
          return { configId: config.configId, value: config.value };
        }
      }),
  }));
}
