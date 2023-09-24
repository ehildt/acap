import { Test, TestingModule } from '@nestjs/testing';

import { ConfigFactoryService } from './config-factory.service';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let cryptoService: CryptoService;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        CryptoService,
        {
          provide: ConfigFactoryService,
          useValue: {
            app: {
              crypto: {
                symmetricAlgorithm: 'aes-256-cbc',
                symmetricKey: '694f676c7dc75a8d644c8cf7f66ac6d0efbcc10e8eaa7b65814577060dfedc35', // 32-byte key
              },
            },
          },
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

    it('should return a decrypted payload', () => {
      const decryptedPayload = cryptoService.decrypt(encryptedPayload);
      expect(decryptedPayload).toBe(payload);
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
