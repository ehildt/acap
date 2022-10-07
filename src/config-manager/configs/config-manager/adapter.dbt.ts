import ShortUniqueId from 'short-unique-id';

export class ManagerConfigAdapter {
  constructor(private copy?: ManagerConfigAdapter) {}

  get NAMESPACE_PREFIX(): string {
    return this.copy?.NAMESPACE_PREFIX ?? process.env.CONFIG_MANAGER_NAMESPACE_PREFIX?.length
      ? process.env.CONFIG_MANAGER_NAMESPACE_PREFIX
      : new ShortUniqueId()(32);
  }

  get TTL(): number {
    return this.copy?.TTL ?? parseInt(process.env.CONFIG_MANAGER_TTL ?? '360', 10);
  }
}
