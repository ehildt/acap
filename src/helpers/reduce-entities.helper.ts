import { JsonSchemaContentsDocument } from '@/schemas/json-schema-content-definition.schema';
import { RealmContentsDocument } from '@/schemas/realm-content-definition.schema';

import { challengeContentValue } from './challenge-content-source.helper';

const entityReducer = (
  previous: Record<string, unknown>,
  document: RealmContentsDocument | JsonSchemaContentsDocument,
  resolveEnv: boolean,
) => ({
  ...previous,
  [document.id]: document.id && challengeContentValue(document.value, resolveEnv),
});

export function reduceEntities(
  resolveEnv: boolean,
  documents?: Array<RealmContentsDocument | JsonSchemaContentsDocument>,
) {
  return documents?.reduce((acc, val) => entityReducer(acc, val, resolveEnv), {});
}
