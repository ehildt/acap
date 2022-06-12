export class ConfigManagerGetReq {
  constructor(copy?: ConfigManagerGetReq) {
    Object.assign(this, copy);
  }

  namespace: string;
  configId: string;
}
