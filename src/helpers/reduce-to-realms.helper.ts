import { reduceToContents } from './reduce-to-contents.helper';

export function reduceToRealms(acc: any, val: any, resolveEnv: boolean) {
  return acc[val.realm]
    ? { ...acc, [val.realm]: { ...acc[val.realm], ...reduceToContents(resolveEnv, [val]) } }
    : { ...acc, [val.realm]: { ...reduceToContents(resolveEnv, [val]) } };
}
