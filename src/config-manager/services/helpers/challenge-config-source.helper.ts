import { challengeParseConfigValue } from './challenge-parse-config-value.helper';

const ENV_CACHE = new Map();

export function challengeConfigValue(value: string) {
  const result = challengeParseConfigValue(value);
  if (typeof result === 'object') return result;
  let data = ENV_CACHE.get(result);
  if (data) return data;
  data = challengeParseConfigValue(process.env[result]);
  ENV_CACHE.set(result, data);
  return data ?? result;
}
