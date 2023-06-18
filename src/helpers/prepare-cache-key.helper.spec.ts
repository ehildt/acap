import { prepareCacheKey } from './prepare-cache-key.helper';

describe('prepare-cache-key', () => {
  it('should return the prepared cache key', () => {
    const key = prepareCacheKey('REALM', 'TEST', 'JEST');
    const defaultPostfix = prepareCacheKey('SCHEMA', 'TEST');
    expect(defaultPostfix).toEqual('$SCHEMA:TEST @CONFIG_MANAGER');
    expect(key).toEqual('$REALM:TEST @JEST');
  });
});
