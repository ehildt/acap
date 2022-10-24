import { LeanDocumentOrArray } from 'mongoose';
import { ConfigManagerDocument } from '@/config-manager/schemas/config-manager.schema';
import { challengeConfigValue } from './challenge-config-source.helper';

const documentReducer = (previous: Record<string, unknown>, document: ConfigManagerDocument) => ({
  ...previous,
  [document.configId]: challengeConfigValue(document.value),
});

export function reduceConfigRes(documents?: LeanDocumentOrArray<ConfigManagerDocument[]>) {
  return documents.reduce(documentReducer, {});
}
