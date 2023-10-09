export function prepareBulkWriteDeleteRealms(realms: string[]) {
  return realms.map((realm) => ({
    deleteOne: { filter: { realm } },
  }));
}
