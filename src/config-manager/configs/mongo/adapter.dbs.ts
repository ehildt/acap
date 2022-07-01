export class MongoConfigAdapter {
  constructor(private copy?: MongoConfigAdapter) {}

  get DB_NAME(): string {
    return this.copy?.DB_NAME ?? process.env.MONGO_DB_NAME;
  }

  get USER(): string {
    return this.copy?.USER ?? process.env.MONGO_USER;
  }

  get PASS(): string {
    return this.copy?.PASS ?? process.env.MONGO_PASS;
  }

  get URI(): string {
    return this.copy?.URI ?? process.env.MONGO_URI;
  }

  get SSL(): boolean {
    return this.copy?.SSL ?? process.env.MONGO_SSL == 'true';
  }

  get SSL_VALIDATE(): boolean {
    return this.copy?.SSL_VALIDATE ?? process.env.MONGO_SSL_VALIDATE == 'true';
  }
}
