import { challengeContentValue } from './challenge-content-source.helper';

export function reduceToContents(resolveEnv: boolean, entities?: Array<any>) {
  return entities?.reduce(
    (acc, { id, value }) => ({
      ...acc,
      [id]: challengeContentValue(value, resolveEnv),
    }),
    {},
  );
}
