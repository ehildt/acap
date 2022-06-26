export class AuthManagerConfigAdapter {
  constructor(private copy?: AuthManagerConfigAdapter) {}

  get USERNAME(): string {
    return (
      this.copy?.USERNAME ?? process.env.AUTH_MANAGER_USERNAME ?? 'superadmin'
    );
  }

  get PASSWORD(): string {
    return (
      this.copy?.PASSWORD ?? process.env.AUTH_MANAGER_PASSWORD ?? 'superadmin'
    );
  }

  get ACCESS_TOKEN_TTL(): number {
    return (
      this.copy?.ACCESS_TOKEN_TTL ??
      parseInt(process.env.AUTH_MANAGER_ACCESS_TOKEN_TTL, 10) ??
      900
    );
  }

  get REFRESH_TOKEN_TTL(): number {
    return (
      this.copy?.REFRESH_TOKEN_TTL ??
      parseInt(process.env.AUTH_MANAGER_REFRESH_TOKEN_TTL, 10) ??
      604800
    );
  }

  get TOKEN_SECRET(): string {
    return (
      this.copy?.TOKEN_SECRET ??
      process.env.AUTH_MANAGER_TOKEN_SECRET ??
      'd742181c71078eb527e4fce1d47a21785bac97cb86518bf43a73acd65dbd9eb0'
    );
  }

  get CONFIG_MANAGER_BASE_URL(): string {
    return (
      this.copy?.CONFIG_MANAGER_BASE_URL ??
      process.env.AUTH_MANAGER_PROVIDER_CONFIG_MANAGER_BASE_URL ??
      'http://localhost:3000'
    );
  }

  get EMAIL(): string {
    return (
      this.copy?.EMAIL ??
      process.env.PROVIDER_AUTH_MANAGER_EMAIL ??
      'super@admin.com'
    );
  }

  get CONSUMER_TOKEN(): string {
    return (
      this.copy?.CONSUMER_TOKEN ??
      process.env.AUTH_MANAGER_PROVIDER_CONFIG_MANAGER_TOKEN ??
      ''
    );
  }
}
