export function prepareBulkWriteDeleteContents(realm: string, req?: string[]) {
  return req
    ? req.map((id) => ({
        deleteOne: { filter: { realm, id } },
      }))
    : [{ deleteMany: { filter: { realm } } }];
}
