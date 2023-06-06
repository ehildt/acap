import { reduceToConfigs } from './reduce-to-configs.helper';

export function reduceToRealms(acc: any, val: any, resolveEnv: boolean) {
  return acc[val.realm]
    ? { ...acc, [val.realm]: { ...acc[val.realm], ...reduceToConfigs(resolveEnv, [val]) } }
    : { ...acc, [val.realm]: { ...reduceToConfigs(resolveEnv, [val]) } };
}
