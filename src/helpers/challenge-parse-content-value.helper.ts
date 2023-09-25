export function challengeParseContentValue(value: any) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
