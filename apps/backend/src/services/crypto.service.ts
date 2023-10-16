import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import crypto from 'crypto';

import { ALGORITHM } from '@/constants/app.constants';
import { ContentUpsertReq } from '@/dtos/content-upsert-req.dto';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { RealmContentsDocument } from '@/schemas/realm-content-definition.schema';

import { ConfigFactoryService } from './config-factory.service';

@Injectable()
export class CryptoService {
  private secret: Buffer;
  private algorithm: string;
  constructor(private readonly configFactory: ConfigFactoryService) {
    if (this.configFactory.app.crypto.secret) {
      this.secret = Buffer.from(this.configFactory.app.crypto.secret);
      this.algorithm = ALGORITHM[this.configFactory.app.crypto.secret.length];
    }
  }

  protected handleEncrypt(data: string, algorithm: string, key: Buffer): string {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(algorithm, key, iv);
      return `${iv.toString('hex')}${cipher.update(data, 'utf8', 'hex')}${cipher.final('hex')}`;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  protected handleDecrypt(value: string, algorithm: string, key: Buffer): string {
    try {
      const iv = value.slice(0, 32);
      const payload = value.slice(32);
      const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
      return `${decipher.update(payload, 'hex', 'utf8')}${decipher.final('utf8')}`;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  encrypt(payload: any) {
    return this.handleEncrypt(
      typeof payload === 'object' ? JSON.stringify(payload) : payload,
      this.algorithm,
      this.secret,
    );
  }

  decrypt(payload: string) {
    return this.handleDecrypt(payload, this.algorithm, this.secret);
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
