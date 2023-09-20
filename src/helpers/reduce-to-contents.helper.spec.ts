import { challengeContentValue } from './challenge-content-source.helper';
import { reduceToContents } from './reduce-to-contents.helper';

describe('reduceToContents', () => {
  it('should return undefined if no entities are provided', () => {
    const result = reduceToContents(true);
    expect(result).toBeUndefined();
  });

  it('should reduce the provided entities into an object using id as key', () => {
    const entity1 = { id: '1', value: 'value1' };
    const entity2 = { id: '2', value: 'value2' };
    const entities = [entity1, entity2];
    const result = reduceToContents(true, entities);
    expect(result).toEqual({
      '1': challengeContentValue('value1', true),
      '2': challengeContentValue('value2', true),
    });
  });

  it('should ignore entities that do not have "id" and "value" properties', () => {
    const entity1 = { id: '1', value: 'value1' };
    const entity2 = { value: 'value2' }; // missing "id" property
    const entity3 = { id: '3' }; // missing "value" property
    const entities = [entity1, entity2, entity3];
    const result = reduceToContents(true, entities);
    expect(result).toEqual({ '1': challengeContentValue('value1', true) });
  });
});
