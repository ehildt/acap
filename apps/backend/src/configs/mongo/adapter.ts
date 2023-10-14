export class MongoConfigAdapter {
  get DB_NAME(): string {
    return process.env.MONGO_DB_NAME;
  }

  get USER(): string {
    return process.env.MONGO_USER;
  }

  get PASS(): string {
    return process.env.MONGO_PASS;
  }

  get URI(): string {
    return process.env.MONGO_URI;
  }

  get SSL(): boolean {
    return process.env.MONGO_SSL == 'true';
  }

  get TLS_ALLOW_INVALID_CERTIFICATES(): boolean {
    return process.env.MONGO_TLS_ALLOW_INVALID_CERTIFICATES == 'true';
  }
}
