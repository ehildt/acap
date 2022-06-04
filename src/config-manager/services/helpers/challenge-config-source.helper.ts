import { CONFIG_SOURCE } from '@/config-manager/constants/config-source.enum';
import { challengeParseConfigValue } from './challenge-parse-config-value.helper';

export function challengeConfigSource(source: CONFIG_SOURCE, value: string) {
  if (source === CONFIG_SOURCE.VALUE) return challengeParseConfigValue(value);

  if (source === CONFIG_SOURCE.ENVIRONMENT)
    return challengeParseConfigValue(process.env[value]);
}
