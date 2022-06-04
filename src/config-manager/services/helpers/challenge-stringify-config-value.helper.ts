export function challengeStringifyConfigValue(
  data: string | Record<string, unknown>,
) {
  return typeof data === 'string' ? data : JSON.stringify(data);
}
