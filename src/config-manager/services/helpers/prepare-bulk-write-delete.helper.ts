export function prepareBulkWriteDelete(namespace: string, req?: string[]) {
  return req
    ? req.map((configId) => ({
        deleteOne: { filter: { namespace, configId } },
      }))
    : [{ deleteMany: { filter: { namespace } } }];
}
