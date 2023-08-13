import { challengeParseContentValue } from './challenge-parse-content-value.helper';

const ENV_CACHE = new Map();

export function challengeContentValue(value: string, resolveEnv: boolean) {
  const result = challengeParseContentValue(value);
  if (typeof result === 'object') return result;
  if (!resolveEnv) return result;
  let envData = ENV_CACHE.get(result);
  if (envData) return envData;
  envData = challengeParseContentValue(process.env[result]);
  if (envData) ENV_CACHE.set(result, envData);
  return envData ?? result;
}
