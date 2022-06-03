export function challengeParseConfigValue(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
