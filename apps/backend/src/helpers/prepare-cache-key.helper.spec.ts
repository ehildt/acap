import { prepareCacheKey } from './prepare-cache-key.helper';

describe('prepareCacheKey', () => {
  it('should return cache key without postfix if no postfix is provided', () => {
    const result = prepareCacheKey('SCHEMA', 'example-realm');
    expect(result).toBe('$SCHEMA:example-realm @CONFIG_MANAGER');
  });

  it('should return cache key with postfix if postfix is provided', () => {
    const result = prepareCacheKey('REALM', 'another-realm', 'testing');
    expect(result).toBe('$REALM:another-realm @testing');
  });
});
