import { generate } from 'short-uuid';

export class ConfigManagerConfigAdapter {
  constructor(private copy?: ConfigManagerConfigAdapter) {}

  get NAMESPACE_PREFIX(): string {
    return this.copy?.NAMESPACE_PREFIX ??
      process.env.CONFIG_MANAGER_NAMESPACE_PREFIX?.length
      ? process.env.CONFIG_MANAGER_NAMESPACE_PREFIX
      : generate();
  }

  get TTL(): number {
    return (
      this.copy?.TTL ?? parseInt(process.env.CONFIG_MANAGER_TTL ?? '360', 10)
    );
  }
}
