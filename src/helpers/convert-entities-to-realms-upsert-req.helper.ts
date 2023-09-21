import { JsonSchemaContentsDocument } from '@/schemas/json-schema-content-definition.schema';
import { RealmContentsDocument } from '@/schemas/realm-content-definition.schema';

export function convertEntitiesToRealmsUpsertReq(
  entities: (RealmContentsDocument | JsonSchemaContentsDocument)[],
  realms?: string[],
) {
  return realms?.map((realm) => ({
    realm,
    contents: entities.filter((entity) => entity.realm === realm).map(({ id, value }) => ({ id, value })),
  }));
}
