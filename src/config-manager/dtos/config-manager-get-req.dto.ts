export class ConfigManagerGetReq {
  constructor(copy?: ConfigManagerGetReq) {
    Object.assign(this, copy);
  }

  serviceId: string;
  configId: string;
}
