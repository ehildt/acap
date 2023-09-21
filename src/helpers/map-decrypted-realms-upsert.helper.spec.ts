import { mapDecryptedRealmsUpsert } from './map-decrypted-realms-upsert.helper';

describe('mapDecryptedRealmsUpsert', () => {
  it('should correctly map the decrypted RealmsUpsertReq array', () => {
    const decrypted = [
      {
        realm: 'Realm 1',
        contents: [
          { id: 1, value: '{"key": "value"}' },
          { id: 2, value: '{"key": "value2"}' },
        ],
      },
      {
        realm: 'Realm 2',
        contents: [
          { id: 3, value: '{"key": "value3"}' },
          { id: 4, value: '{"key": "value4"}' },
        ],
      },
    ];

    const expectedMappedArray = [
      {
        realm: 'Realm 1',
        contents: [
          { id: 1, value: { key: 'value' } },
          { id: 2, value: { key: 'value2' } },
        ],
      },
      {
        realm: 'Realm 2',
        contents: [
          { id: 3, value: { key: 'value3' } },
          { id: 4, value: { key: 'value4' } },
        ],
      },
    ];

    const mappedArray = mapDecryptedRealmsUpsert(decrypted as Array<any>);

    expect(mappedArray).toEqual(expectedMappedArray);
  });
});
