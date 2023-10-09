import { prepareBulkWriteContents } from './prepare-bulk-write-contents.helper';

describe('prepareBulkWriteContents', () => {
  it('should return an array of update operations', () => {
    const req = [
      { id: '123', value: 'value1' },
      { id: '456', value: { prop: 'value2' } },
      { id: '789', value: 'value3' },
    ];
    const realm = 'testRealm';
    const result = prepareBulkWriteContents(req, realm);

    expect(result.length).toBe(req.length);

    result.forEach((operation) => {
      expect(typeof operation).toBe('object');
      expect(operation).toHaveProperty('updateOne');
      expect(typeof operation.updateOne).toBe('object');
      expect(operation.updateOne).toHaveProperty('upsert', true);
      expect(operation.updateOne).toHaveProperty('filter');
      expect(typeof operation.updateOne.filter).toBe('object');
      expect(operation.updateOne.filter).toEqual({ id: expect.any(String), realm });
      expect(operation.updateOne).toHaveProperty('update');
      expect(typeof operation.updateOne.update).toBe('object');
      expect(operation.updateOne.update).toEqual({
        value:
          typeof operation.updateOne.update.value === 'object'
            ? JSON.stringify(operation.updateOne.update.value)
            : operation.updateOne.update.value,
      });
    });
  });
});
