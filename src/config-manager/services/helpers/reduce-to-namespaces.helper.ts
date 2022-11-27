import { reduceToConfigs } from './reduce-to-configs.helper';

export function reduceToNamespaces(acc: any, val: any) {
  return acc[val.namespace]
    ? { ...acc, [val.namespace]: { ...acc[val.namespace], ...reduceToConfigs([val]) } }
    : { ...acc, [val.namespace]: { ...reduceToConfigs([val]) } };
}
