import { challengeParseContentValue } from './challenge-parse-content-value.helper';

describe('challengeParseContentValue', () => {
  it('should parse valid JSON string values', () => {
    const value = '{"name":"John","age":30,"city":"New York"}';
    const expectedResult = { name: 'John', age: 30, city: 'New York' };
    const result = challengeParseContentValue(value);
    expect(result).toEqual(expectedResult);
  });

  it('should parse strings', () => {
    const value = 'Yummy';
    const result = challengeParseContentValue('Yummy');
    expect(result).toEqual(value);
  });

  it('should parse boolean values', () => {
    const result = challengeParseContentValue('true');
    expect(result).toBeTrue();
  });

  it('should parse number values', () => {
    const result = challengeParseContentValue('42');
    expect(result).toBeNumber();
  });

  it('should handle undefined value', () => {
    const result = challengeParseContentValue(undefined);
    expect(result).toBeUndefined();
  });

  it('should handle null value', () => {
    const result = challengeParseContentValue(null);
    expect(result).toBeNull();
  });

  it('should parse arrays', () => {
    const result = challengeParseContentValue('[1, 2, 3]');
    expect(result).toEqual([1, 2, 3]);
  });
});
