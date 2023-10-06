import { prepareBulkWriteDeleteRealms } from './prepare-bulk-write-delete-realms.helper';

describe('prepareBulkWriteDeleteRealms', () => {
  it('should return an array of delete operations', () => {
    const realms = ['realm1', 'realm2', 'realm3'];
    const result = prepareBulkWriteDeleteRealms(realms);
    expect(result.length).toBe(realms.length);
    result.forEach((operation) => {
      expect(typeof operation).toBe('object');
      expect(operation).toHaveProperty('deleteOne');
      expect(typeof operation.deleteOne).toBe('object');
      expect(operation.deleteOne).toHaveProperty('filter');
      expect(typeof operation.deleteOne.filter).toBe('object');
      expect(operation.deleteOne.filter).toEqual({ realm: expect.any(String) });
    });
  });
});
