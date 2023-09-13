import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';

export function mapDecryptedRealmsUpsert(decrypted: Array<RealmsUpsertReq>) {
  return decrypted.map(({ realm, contents }) => ({
    realm,
    contents: contents.map(({ id, value }) => {
      try {
        return { id, value: JSON.parse(String(value)) };
      } catch {
        return { id, value };
      }
    }),
  }));
}
