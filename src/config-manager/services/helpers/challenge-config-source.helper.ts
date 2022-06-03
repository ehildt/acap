import { challengeParseConfigValue } from './challenge-parse-config-value.helper';

export function challengeConfigSource(value: string) {
  const result = challengeParseConfigValue(value);
  let data: any;

  if (typeof result === 'string')
    data = challengeParseConfigValue(process.env[result]);

  return data ?? result;
}
