export function prepareBulkWriteDeleteNamespaces(namespaces: string[]) {
  return namespaces.map((namespace) => ({
    deleteOne: { filter: { namespace } },
  }));
}
