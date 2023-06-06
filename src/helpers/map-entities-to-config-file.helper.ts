import { RealmConfigs } from '@/schemas/configs.schema';

export function mapEntitiesToConfigFile(entities: RealmConfigs[], realms?: string[]) {
  return realms?.map((realm) => ({
    realm,
    configs: entities
      .filter((entity) => entity.realm === realm)
      .map((config) => {
        try {
          return { configId: config.configId, value: JSON.parse(config.value) };
        } catch {
          return { configId: config.configId, value: config.value };
        }
      }),
  }));
}
