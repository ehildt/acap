import { JsonSchemaConfigsDocument } from '@/schemas/json-schema-config-definition.schema';
import { RealmConfigsDocument } from '@/schemas/realm-configs-definition.schema';

export function mapEntitiesToConfigFile(
  entities: RealmConfigsDocument[] | JsonSchemaConfigsDocument[],
  realms?: string[],
) {
  return realms?.map((realm) => ({
    realm,
    configs: entities
      .filter((entity) => entity.realm === realm)
      .map((config) => {
        try {
          return { id: config.id, value: JSON.parse(config.value) };
        } catch {
          return { id: config.id, value: config.value };
        }
      }),
  }));
}
