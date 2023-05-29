export function prepareBulkWriteDeleteConfigs(realm: string, req?: string[]) {
  return req
    ? req.map((configId) => ({
        deleteOne: { filter: { realm, configId } },
      }))
    : [{ deleteMany: { filter: { realm } } }];
}
