import { challengeConfigValue } from './challenge-config-source.helper';

export function reduceToConfigs(resolveEnv: boolean, entities?: Array<any>) {
  return entities?.reduce(
    (acc, { id, value }) => ({
      ...acc,
      [id]: challengeConfigValue(value, resolveEnv),
    }),
    {},
  );
}
