import { prepareBulkWriteDeleteContents } from './prepare-bulk-write-delete-contents.helper';

describe('prepareBulkWriteDeleteContents', () => {
  test('should return an array of delete operations when req is provided', () => {
    const realm = 'realm';
    const result = prepareBulkWriteDeleteContents(realm, ['id1', 'id2']);
    expect(result).toEqual([
      { deleteOne: { filter: { realm, id: 'id1' } } },
      { deleteOne: { filter: { realm, id: 'id2' } } },
    ]);
  });

  test('should return an array with deleteMany operation when req is not provided', () => {
    const realm = 'realm2';
    const result = prepareBulkWriteDeleteContents(realm);
    expect(result).toEqual([{ deleteMany: { filter: { realm } } }]);
  });
});
