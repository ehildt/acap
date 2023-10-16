import { UnprocessableEntityException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigFactoryService } from './config-factory.service';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let cryptoService: CryptoService;
  let moduleRef: TestingModule;
  let mockConfigFactory: Partial<ConfigFactoryService>;

  beforeEach(async () => {
    mockConfigFactory = {
      app: {
        crypto: {
          secret: 'a4e8b65e2c3e167942bcf48abf6e9d71',
          algorithm: 'aes-256-cbc',
        },
      } as any,
    };
    moduleRef = await Test.createTestingModule({
      providers: [
        CryptoService,
        {
          provide: ConfigFactoryService,
          useValue: mockConfigFactory,
        },
      ],
    }).compile();

    cryptoService = moduleRef.get<CryptoService>(CryptoService);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('crypto', () => {
    let encryptedPayload: string;
    const payload = 'encrypt me';

    it('should return an encrypted payload', () => {
      encryptedPayload = cryptoService.encrypt(payload);
      expect(encryptedPayload).not.toBe(payload);
    });

    it('should throw an error when encrypting payload', async () => {
      mockConfigFactory.app.crypto.secret = '1234';
      try {
        cryptoService.encrypt(payload);
      } catch (error) {
        expect(error).toEqual(new UnprocessableEntityException('Invalid initialization vector'));
      }
    });

    it('should return a decrypted payload', () => {
      const decryptedPayload = cryptoService.decrypt(encryptedPayload);
      expect(decryptedPayload).toBe(payload);
    });

    it('should throw an error when decrypting payload', async () => {
      mockConfigFactory.app.crypto.secret = '1234';
      try {
        cryptoService.decrypt(payload);
      } catch (error) {
        expect(error).toEqual(new UnprocessableEntityException('Invalid initialization vector'));
      }
    });
  });

  describe('crypto helpers ', () => {
    const entityValues = [
      { value: 'one', id: '1' },
      { value: 'two', id: '2' },
    ] as any;

    const realmUpsertReq = [{ realm: 'test', contents: [{ id: '1', value: 'one' }] }];
    const contentUpsertReqs = [{ id: '1', value: 'one' }];

    it('should decryptEntityValues successfully', () => {
      const encrypted = cryptoService.encryptContentUpsertReqs(entityValues);
      const decrypted = cryptoService.decryptEntityValues(encrypted as any);
      expect(decrypted).toEqual(entityValues);
    });

    it('should encryptRealmsUpsertReq, decryptRealmsUpsertReq successfully', () => {
      const encrypted = cryptoService.encryptRealmsUpsertReq(realmUpsertReq);
      const decrypted = cryptoService.decryptRealmsUpsertReq(encrypted as any);
      expect(decrypted).toEqual(realmUpsertReq);
    });

    it('should encryptContentUpsertReqs, decryptContentUpsertReqs successfully', () => {
      const encrypted = cryptoService.encryptContentUpsertReqs(contentUpsertReqs);
      const decrypted = cryptoService.decryptContentUpsertReqs(encrypted as any);
      expect(decrypted).toEqual(contentUpsertReqs);
    });
  });
});
