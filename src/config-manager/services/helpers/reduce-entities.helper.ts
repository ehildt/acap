import { LeanDocumentOrArray } from 'mongoose';

import { ConfigManagerConfigsDocument } from '@/config-manager/schemas/configs.schema';

import { challengeConfigValue } from './challenge-config-source.helper';

const entityReducer = (
  previous: Record<string, unknown>,
  document: LeanDocumentOrArray<ConfigManagerConfigsDocument>,
) => ({
  ...previous,
  [document.configId]: challengeConfigValue(document.value),
});

export function reduceEntities(documents?: LeanDocumentOrArray<ConfigManagerConfigsDocument[]>) {
  return documents?.reduce(entityReducer, {});
}
