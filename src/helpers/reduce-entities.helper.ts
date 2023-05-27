import { ConfigManagerConfigsDocument } from '@/schemas/configs.schema';

import { challengeConfigValue } from './challenge-config-source.helper';

const entityReducer = (
  previous: Record<string, unknown>,
  document: ConfigManagerConfigsDocument,
  resolveEnv: boolean,
) => ({
  ...previous,
  [document.configId]: challengeConfigValue(document.value, resolveEnv),
});

export function reduceEntities(resolveEnv: boolean, documents?: ConfigManagerConfigsDocument[]) {
  return documents?.reduce((acc, val) => entityReducer(acc, val, resolveEnv), {});
}
