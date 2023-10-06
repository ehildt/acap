import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import crypto from 'crypto';

import { ContentUpsertReq } from '@/dtos/content-upsert-req.dto';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { RealmContentsDocument } from '@/schemas/realm-content-definition.schema';

import { ConfigFactoryService } from './config-factory.service';

@Injectable()
export class CryptoService {
  constructor(private readonly configFactory: ConfigFactoryService) {}

  protected handleEncrypt(data: string, algorithm: string, key: string): string {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), iv);
      return `${iv.toString('hex')}:${cipher.update(data, 'utf8', 'hex')}${cipher.final('hex')}`;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  protected handleDecrypt(value: string, algorithm: string, key: string): string {
    try {
      const [iv, payload] = value.split(':');
      const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
      return `${decipher.update(payload, 'hex', 'utf8')}${decipher.final('utf8')}`;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  encrypt(payload: any) {
    return this.handleEncrypt(
      typeof payload === 'object' ? JSON.stringify(payload) : payload,
      this.configFactory.app.crypto.symmetricAlgorithm,
      this.configFactory.app.crypto.symmetricKey,
    );
  }

  decrypt(payload: string) {
    return this.handleDecrypt(
      payload,
      this.configFactory.app.crypto.symmetricAlgorithm,
      this.configFactory.app.crypto.symmetricKey,
    );
  }

  decryptEntityValues(entities: Array<RealmContentsDocument>): Array<any> {
    return entities.map(({ value, ...rest }) => ({ ...rest, value: this.decrypt(value) }));
  }

  encryptRealmsUpsertReq(realms: Array<RealmsUpsertReq>): Array<RealmsUpsertReq> {
    return realms.map(({ realm, contents }) => ({
      realm,
      contents: contents.map(({ id, value }) => ({ id, value: this.encrypt(value) })),
    }));
  }

  decryptRealmsUpsertReq(realms: Array<RealmsUpsertReq>): Array<RealmsUpsertReq> {
    return realms.map(({ realm, contents }) => ({
      realm,
      contents: contents.map(({ id, value }) => ({ id, value: this.decrypt(String(value)) })),
    }));
  }

  encryptContentUpsertReqs(reqs: Array<ContentUpsertReq>): Array<ContentUpsertReq> {
    return reqs.map(({ id, value }) => ({ id, value: this.encrypt(value) }));
  }

  decryptContentUpsertReqs(reqs: Array<ContentUpsertReq>): Array<ContentUpsertReq> {
    return reqs.map(({ id, value }) => ({ id, value: this.decrypt(String(value)) }));
  }
}
