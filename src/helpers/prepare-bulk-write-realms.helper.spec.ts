import { prepareBulkWriteRealms } from './prepare-bulk-write-realms.helper';

describe('prepareBulkWriteRealms', () => {
  it('should return an array of update operations', () => {
    const req = ['realm1', 'realm2', 'realm3'];
    const result = prepareBulkWriteRealms(req);

    expect(result.length).toBe(req.length);

    result.forEach((operation) => {
      expect(typeof operation).toBe('object');
      expect(operation).toHaveProperty('updateOne');
      expect(typeof operation.updateOne).toBe('object');
      expect(operation.updateOne).toHaveProperty('upsert', true);
      expect(operation.updateOne).toHaveProperty('filter');
      expect(typeof operation.updateOne.filter).toBe('object');
      expect(operation.updateOne.filter).toEqual({ realm: operation.updateOne.filter.realm });
      expect(operation.updateOne).toHaveProperty('update');
      expect(typeof operation.updateOne.update).toBe('object');
      expect(operation.updateOne.update).toEqual({ realm: operation.updateOne.update.realm });
    });
  });
});
