import { ConfigManagerUpsertRes } from '@/config-manager/dtos/config-manager-upsert-res.dto';
import { ConfigManagerDocument } from '@/config-manager/schemas/config-manager.schema';
import { challengeConfigSource } from './challenge-config-source.helper';

const documentMapper = (document: ConfigManagerDocument) =>
  new ConfigManagerUpsertRes({
    value: challengeConfigSource(document.source, document.value),
    configId: document.configId,
    source: document.source,
  });

export function mapConfigRes(
  document?: ConfigManagerDocument | ConfigManagerDocument[],
) {
  if (!document) return;
  if (!Array.isArray(document)) return documentMapper(document);
  const data = document.map(documentMapper);
  if (data.length) return data;
}
