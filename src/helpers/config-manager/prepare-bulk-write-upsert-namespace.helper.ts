export function prepareBulkWriteNamespaces(req: string[]) {
  return req.map((namespace) => ({
    updateOne: {
      upsert: true,
      filter: { namespace },
      update: { namespace },
    },
  }));
}
