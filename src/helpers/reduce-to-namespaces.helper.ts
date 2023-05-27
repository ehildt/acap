import { reduceToConfigs } from './reduce-to-configs.helper';

export function reduceToNamespaces(acc: any, val: any, resolveEnv: boolean) {
  return acc[val.namespace]
    ? { ...acc, [val.namespace]: { ...acc[val.namespace], ...reduceToConfigs(resolveEnv, [val]) } }
    : { ...acc, [val.namespace]: { ...reduceToConfigs(resolveEnv, [val]) } };
}
