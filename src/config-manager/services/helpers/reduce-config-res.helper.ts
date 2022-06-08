import { ConfigManagerDocument } from '@/config-manager/schemas/config-manager.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { challengeConfigSource } from './challenge-config-source.helper';

const NO_CONTENT = 'NoContent';

const documentReducer = (
  previous: Record<string, unknown>,
  document: ConfigManagerDocument,
) => ({
  ...previous,
  [document.configId]: challengeConfigSource(document.source, document.value),
});

export function reduceConfigRes(documents?: ConfigManagerDocument[]) {
  if (documents?.length) return documents.reduce(documentReducer, {});
  throw new HttpException(NO_CONTENT, HttpStatus.NO_CONTENT);
}
