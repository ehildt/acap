import ShortUniqueId from 'short-unique-id';

const shortUniqueId = new ShortUniqueId()(32);

export class ConfigManagerAdapter {
  get NAMESPACE_POSTFIX(): string {
    return process.env.CONFIG_MANAGER_NAMESPACE_POSTFIX ?? shortUniqueId;
  }

  get TTL(): number {
    return parseInt(process.env.CONFIG_MANAGER_TTL ?? '360', 10);
  }

  get RESOLVE_ENV(): boolean {
    return process.env.CONFIG_MANAGER_RESOLVE_ENV === 'true';
  }
}
