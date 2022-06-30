export function prepareBulkWriteDelete(serviceId: string, req?: string[]) {
  return req
    ? req.map((configId) => ({
        deleteOne: { filter: { serviceId, configId } },
      }))
    : [{ deleteMany: { filter: { serviceId } } }];
}
