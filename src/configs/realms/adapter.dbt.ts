import ShortUniqueId from 'short-unique-id';

const shortUniqueId = new ShortUniqueId()(32);

export class RealmAdapter {
  get NAMESPACE_POSTFIX(): string {
    return process.env.REALM_NAMESPACE_POSTFIX ?? shortUniqueId;
  }

  get TTL(): number {
    return parseInt(process.env.REALM_TTL ?? '360', 10);
  }

  get RESOLVE_ENV(): boolean {
    return process.env.REALM_RESOLVE_ENV === 'true';
  }

  get GZIP_THRESHOLD(): number {
    return parseInt(process.env.REALM_GZIP_THRESHOLD ?? '20', 10);
  }
}
