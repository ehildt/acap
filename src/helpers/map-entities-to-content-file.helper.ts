import { JsonSchemaContentsDocument } from '@/schemas/json-schema-content-definition.schema';
import { RealmContentsDocument } from '@/schemas/realm-content-definition.schema';

export function mapEntitiesToContentFile(
  entities: (RealmContentsDocument | JsonSchemaContentsDocument)[],
  realms?: string[],
) {
  return realms?.map((realm) => ({
    realm,
    contents: entities
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
