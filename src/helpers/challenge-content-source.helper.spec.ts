import { challengeContentValue } from './challenge-content-source.helper';

const ENV_CACHE = new Map();

describe('challengeContentValue', () => {
  beforeEach(() => {
    // Clear the ENV_CACHE before each test
    ENV_CACHE.clear();
  });

  it('should return the parsed value if it is an object', () => {
    const result = challengeContentValue('{}', true);
    expect(result).toEqual({});
  });

  it('should return the parsed value if resolveEnv is false', () => {
    const result = challengeContentValue('SOME_VALUE', false);
    expect(result).toEqual('SOME_VALUE');
  });

  it('should parse and cache value from process.env', () => {
    const value = 'SOME_VALUE';
    const parsedValue = 'Parsed Data';
    ENV_CACHE.set(value, parsedValue);
    process.env.SOME_VALUE = parsedValue;
    const result = challengeContentValue(value, true);
    expect(result).toEqual(parsedValue);
    expect(ENV_CACHE.get(value)).toEqual(parsedValue);
  });

  it('should return the original value if parsing from process.env fails', () => {
    const value = 'NON_EXISTING_VALUE';
    const result = challengeContentValue(value, true);
    expect(result).toEqual('NON_EXISTING_VALUE');
  });
});
