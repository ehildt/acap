export function prepareBulkWriteRealms(req: string[]) {
  return req.map((realm) => ({
    updateOne: {
      upsert: true,
      filter: { realm },
      update: { realm },
    },
  }));
}
