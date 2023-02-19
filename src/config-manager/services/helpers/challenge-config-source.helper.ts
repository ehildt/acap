import { challengeParseConfigValue } from './challenge-parse-config-value.helper';

const ENV_CACHE = new Map();

export function challengeConfigValue(value: string, resolveEnv: boolean) {
  const result = challengeParseConfigValue(value);
  if (typeof result === 'object') return result;
  if (!resolveEnv) return result;
  let envData = ENV_CACHE.get(result);
  if (envData) return envData;
  envData = challengeParseConfigValue(process.env[result]);
  if (envData) ENV_CACHE.set(result, envData);
  return envData ?? result;
}
