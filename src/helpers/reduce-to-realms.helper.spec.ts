import { reduceToContents } from './reduce-to-contents.helper';
import { reduceToRealms } from './reduce-to-realms.helper';

describe('reduceToRealms', () => {
  it('should correctly reduce objects to realms when realm is not present in acc', () => {
    const val = { realm: 'someRealm' };
    const resolveEnv = true;
    const result = reduceToRealms({}, val, resolveEnv);
    expect(result).toEqual({
      someRealm: { ...reduceToContents(resolveEnv, [val]) },
    });
  });

  it('should correctly reduce objects to realms when realm is already present in acc', () => {
    const acc = { someRealm: { existingValue: 'existing' } };
    const val = { realm: 'someRealm', newValue: 'new' };
    const resolveEnv = true;
    const result = reduceToRealms(acc, val, resolveEnv);
    expect(result).toEqual({
      someRealm: { ...reduceToContents(resolveEnv, [val]), existingValue: 'existing' },
    });
  });
});
