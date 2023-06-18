type Descriptor = 'SCHEMA' | 'REALM';

export function prepareCacheKey(descriptor: Descriptor, realm: string, postfix?: string) {
  if (!postfix) return `$${descriptor}:${realm} @CONFIG_MANAGER`;
  return `$${descriptor}:${realm} @${postfix}`;
}
