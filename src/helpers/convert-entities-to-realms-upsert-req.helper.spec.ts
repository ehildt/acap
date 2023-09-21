import { RealmContentsDocument } from '@/schemas/realm-content-definition.schema';

import { convertEntitiesToRealmsUpsertReq } from './convert-entities-to-realms-upsert-req.helper';

describe('convertEntitiesToRealmsUpsertReq', () => {
  it('should return an array of realms with their corresponding contents', () => {
    const entities: Partial<Array<RealmContentsDocument>> = [
      { realm: 'realm1', id: '1', value: 'value1' },
      { realm: 'realm2', id: '2', value: 'value2' },
      { realm: 'realm1', id: '3', value: 'value3' },
    ] as any;

    const realms = ['realm1', 'realm2'];
    const result = convertEntitiesToRealmsUpsertReq(entities, realms);
    expect(result).toEqual([
      {
        realm: 'realm1',
        contents: [
          { id: '1', value: 'value1' },
          { id: '3', value: 'value3' },
        ],
      },
      { realm: 'realm2', contents: [{ id: '2', value: 'value2' }] },
    ]);
  });

  it('should return an array with realms and empty contents when entities both empty and not empty', () => {
    const entities: Partial<Array<RealmContentsDocument>> = [{ realm: 'realm1', id: '1', value: 'value1' }] as any;
    const realms = ['realm1', 'realm2'];
    const result = convertEntitiesToRealmsUpsertReq(entities, realms);
    expect(result).toEqual([
      { realm: 'realm1', contents: [{ id: '1', value: 'value1' }] },
      { realm: 'realm2', contents: [] },
    ]);
  });

  it('should return undefined when realms are not provided', () => {
    const entities: Partial<Array<RealmContentsDocument>> = [{ realm: 'realm1', id: '1', value: 'value1' }] as any;
    const result = convertEntitiesToRealmsUpsertReq(entities);
    expect(result).toBeUndefined();
  });
});
