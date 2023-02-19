import { challengeConfigValue } from './challenge-config-source.helper';

export function reduceToConfigs(resolveEnv: boolean, entities?: Array<any>) {
  return entities?.reduce(
    (acc, { configId, value }) => ({
      ...acc,
      [configId]: challengeConfigValue(value, resolveEnv),
    }),
    {},
  );
}
