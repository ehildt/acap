import { ConfigManagerDocument } from '@/config-manager/schemas/config-manager.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { challengeConfigSource } from './challenge-config-source.helper';

const NO_CONTENT = 'NoContent';

const documentMapper = ({
  configId,
  source,
  value,
}: ConfigManagerDocument) => ({
  configId,
  source,
  value: challengeConfigSource(source, value),
});

export function mapConfigRes(documents?: ConfigManagerDocument[]) {
  if (documents?.length) return documents.map(documentMapper, {});
  throw new HttpException(NO_CONTENT, HttpStatus.NO_CONTENT);
}
