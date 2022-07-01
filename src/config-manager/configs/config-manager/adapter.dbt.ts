import ShortUniqueId from 'short-unique-id';

const shortUniqueId = new ShortUniqueId()(32);

export class ManagerConfigAdapter {
  get NAMESPACE_PREFIX(): string {
    return process.env.CONFIG_MANAGER_NAMESPACE_PREFIX ?? shortUniqueId;
  }

  get TTL(): number {
    return parseInt(process.env.CONFIG_MANAGER_TTL ?? '360', 10);
  }
}
