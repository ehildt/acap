import { challengeContentValue } from './challenge-content-source.helper';
import { reduceEntities } from './reduce-entities.helper';

describe('reduceEntities', () => {
  it('should return undefined if no documents are provided', () => {
    const result = reduceEntities(true);
    expect(result).toBeUndefined();
  });

  it('should reduce the provided documents into an object', () => {
    const document1 = { id: '1', value: 'value1' };
    const document2 = { id: '2', value: 'value2' };
    const documents = [document1, document2] as Array<any>;
    const result = reduceEntities(true, documents);
    expect(result).toEqual({
      '1': challengeContentValue('value1', true),
      '2': challengeContentValue('value2', true),
    });
  });

  it('should ignore documents that do not have "id" and "value" properties', () => {
    const document1 = { id: '1', value: 'value1' };
    const document2 = { value: 'value2' }; // missing "id" property
    const document3 = { id: '3' }; // missing "value" property
    const documents = [document1, document2, document3] as Array<any>;
    const result = reduceEntities(true, documents);
    expect(result).toEqual({ '1': challengeContentValue('value1', true) });
  });
});
