import { RealmConfigsDocument } from '@/schemas/configs.schema';

import { challengeConfigValue } from './challenge-config-source.helper';

const entityReducer = (previous: Record<string, unknown>, document: RealmConfigsDocument, resolveEnv: boolean) => ({
  ...previous,
  [document.configId]: challengeConfigValue(document.value, resolveEnv),
});

export function reduceEntities(resolveEnv: boolean, documents?: RealmConfigsDocument[]) {
  return documents?.reduce((acc, val) => entityReducer(acc, val, resolveEnv), {});
}
