import { RealmConfigsDocument } from '@/schemas/realm-configs-definition.schema';

import { challengeConfigValue } from './challenge-config-source.helper';

const entityReducer = (previous: Record<string, unknown>, document: RealmConfigsDocument, resolveEnv: boolean) => ({
  ...previous,
  [document.id]: challengeConfigValue(document.value, resolveEnv),
});

export function reduceEntities(resolveEnv: boolean, documents?: RealmConfigsDocument[]) {
  return documents?.reduce((acc, val) => entityReducer(acc, val, resolveEnv), {});
}
