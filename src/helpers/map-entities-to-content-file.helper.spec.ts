import { JsonSchemaContentsDocument } from '@/schemas/json-schema-content-definition.schema';
import { RealmContentsDocument } from '@/schemas/realm-content-definition.schema';

import { mapEntitiesToContentFile } from './map-entities-to-content-file.helper';

describe('mapEntitiesToContentFile', () => {
  test('should correctly map entities to content file', () => {
    const entities: (RealmContentsDocument | JsonSchemaContentsDocument)[] = [
      {
        realm: 'realm1',
        id: 'id1',
        value: '{ "key": "value1" }',
      },
      {
        realm: 'realm2',
        id: 'id2',
        value: '{ "key": "value2" }',
      },
      {
        realm: 'realm1',
        id: 'id3',
        value: '{ "key": "value3" }',
      },
    ] as any;

    const realms: string[] = ['realm1', 'realm2'];
    const result = mapEntitiesToContentFile(entities, realms);

    expect(result).toEqual([
      {
        realm: 'realm1',
        contents: [
          {
            id: 'id1',
            value: { key: 'value1' },
          },
          {
            id: 'id3',
            value: { key: 'value3' },
          },
        ],
      },
      {
        realm: 'realm2',
        contents: [
          {
            id: 'id2',
            value: { key: 'value2' },
          },
        ],
      },
    ]);
  });
});
