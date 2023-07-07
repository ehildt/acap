import { JsonSchemaConfigsDocument } from '@/schemas/json-schema-config-definition.schema';
import { RealmConfigsDocument } from '@/schemas/realm-configs-definition.schema';

import { challengeConfigValue } from './challenge-config-source.helper';

const entityReducer = (
  previous: Record<string, unknown>,
  document: RealmConfigsDocument | JsonSchemaConfigsDocument,
  resolveEnv: boolean,
) => ({
  ...previous,
  [document.id]: challengeConfigValue(document.value, resolveEnv),
});

export function reduceEntities(
  resolveEnv: boolean,
  documents?: Array<RealmConfigsDocument | JsonSchemaConfigsDocument>,
) {
  return documents?.reduce((acc, val) => entityReducer(acc, val, resolveEnv), {});
}
