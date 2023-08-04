export function challengeParseContentValue(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
