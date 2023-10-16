import { Test, TestingModule } from '@nestjs/testing';

import { MQTT_CLIENT, MqttClient } from '@/modules/mqtt-client.module';
import { RealmRepository } from '@/repositories/realm.repository';

import { ConfigFactoryService } from './config-factory.service';
import { CryptoService } from './crypto.service';
import { RealmService } from './realm.service';

const mockConfigRepo = {
  upsert: jest.fn().mockReturnValue({ ok: true }),
  upsertMany: jest.fn().mockReturnValue({ ok: true }),
  where: jest.fn(),
  delete: jest.fn(),
  countContents: jest.fn(),
  countRealms: jest.fn(),
};

const mockFactory = {
  app: {
    crypto: {
      algorithm: false,
    },
    realm: {
      resolveEnv: jest.fn(),
    },
  },
};

const mockCryptoService = {
  encryptContentUpsertReqs: jest.fn(),
  encryptRealmsUpsertReq: jest.fn(),
  decryptEntityValues: jest.fn(),
};

describe('RealmService', () => {
  let realmService: RealmService;
  let mockMqttClient: Partial<MqttClient>;

  beforeEach(async () => {
    mockMqttClient = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RealmService,
        { provide: MQTT_CLIENT, useValue: mockMqttClient },
        { provide: RealmRepository, useValue: mockConfigRepo },
        { provide: ConfigFactoryService, useValue: mockFactory },
        { provide: CryptoService, useValue: mockCryptoService },
      ],
    }).compile();

    realmService = module.get<RealmService>(RealmService);
    mockMqttClient = module.get<MqttClient>(MQTT_CLIENT);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upsertRealm', () => {
    const realm = 'exampleRealm';
    const reqs = [{ id: '1', value: 'one' }];

    it('should call upsertRealm method with encrypted payload', async () => {
      mockFactory.app.crypto.algorithm = true;
      mockCryptoService.encryptContentUpsertReqs.mockReturnValue(reqs);
      await realmService.upsertRealm(realm, reqs);
      expect(mockCryptoService.encryptContentUpsertReqs).toHaveBeenCalledWith(reqs);
      expect(mockConfigRepo.upsert).toHaveBeenCalledWith(realm, reqs);
    });

    it('should call upsertRealm method with payload', async () => {
      mockFactory.app.crypto.algorithm = false;
      await realmService.upsertRealm(realm, reqs);
      expect(mockCryptoService.encryptContentUpsertReqs).not.toHaveBeenCalled();
      expect(mockConfigRepo.upsert).toHaveBeenCalledWith(realm, reqs);
    });
  });

  describe('upsertRealms', () => {
    const realm = 'exampleRealm';
    const contents = [{ id: '1', value: 'one' }];
    const reqs = [{ realm, contents }];

    it('should call upsertRealms method with encrypted payload', async () => {
      mockFactory.app.crypto.algorithm = true;
      mockCryptoService.encryptRealmsUpsertReq.mockReturnValue(reqs);
      await realmService.upsertRealms(reqs);
      expect(mockCryptoService.encryptRealmsUpsertReq).toHaveBeenCalledWith(reqs);
      expect(mockConfigRepo.upsertMany).toHaveBeenCalledWith(reqs);
      expect(mockMqttClient.publish).toHaveBeenCalled();
    });

    it('should call upsertRealms method with payload', async () => {
      mockFactory.app.crypto.algorithm = false;
      await realmService.upsertRealms(reqs);
      expect(mockCryptoService.encryptRealmsUpsertReq).not.toHaveBeenCalled();
      expect(mockConfigRepo.upsertMany).toHaveBeenCalledWith(reqs);
      expect(mockMqttClient.publish).toHaveBeenCalled();
    });
  });

  describe('getRealm', () => {
    const realm = 'exampleRealm';
    const contents = [{ id: '1', value: 'one' }];

    it('should call getRealm method with encrypted payload', async () => {
      mockFactory.app.crypto.algorithm = true;
      mockConfigRepo.where.mockReturnValue(contents);
      mockCryptoService.decryptEntityValues.mockReturnValue(contents);
      await realmService.getRealm(realm);
      expect(mockCryptoService.decryptEntityValues).toHaveBeenCalledWith(contents);
      expect(mockConfigRepo.where).toHaveBeenCalledWith({ realm });
    });

    it('should call getRealm method with payload', async () => {
      mockFactory.app.crypto.algorithm = false;
      mockConfigRepo.where.mockReturnValue(contents);
      mockCryptoService.decryptEntityValues.mockReturnValue(contents);
      await realmService.getRealm(realm);
      expect(mockCryptoService.decryptEntityValues).not.toHaveBeenCalled();
      expect(mockConfigRepo.where).toHaveBeenCalledWith({ realm });
    });
  });

  describe('getRealmContentByIds', () => {
    const realm = 'exampleRealm';
    const ids = ['1', '2'];
    const contents = [
      { id: '1', value: 'one' },
      { id: '2', value: 'two' },
    ];

    it('should call getRealmContentByIds method with encrypted payload', async () => {
      mockFactory.app.crypto.algorithm = true;
      mockConfigRepo.where.mockReturnValue(contents);
      mockCryptoService.decryptEntityValues.mockReturnValue(contents);
      await realmService.getRealmContentByIds(realm, ids);
      expect(mockCryptoService.decryptEntityValues).toHaveBeenCalledWith(contents);
      expect(mockConfigRepo.where).toHaveBeenCalledWith({ realm, id: { $in: ids } });
    });

    it('should call getRealmContentByIds method with payload', async () => {
      mockFactory.app.crypto.algorithm = false;
      mockConfigRepo.where.mockReturnValue(contents);
      mockCryptoService.decryptEntityValues.mockReturnValue(contents);
      await realmService.getRealmContentByIds(realm, ids);
      expect(mockCryptoService.decryptEntityValues).not.toHaveBeenCalled();
      expect(mockConfigRepo.where).toHaveBeenCalledWith({ realm, id: { $in: ids } });
    });

    it('should throw if not all ids can be fetched', async () => {
      mockFactory.app.crypto.algorithm = false;
      mockConfigRepo.where.mockReturnValue(contents.slice(1));
      mockCryptoService.decryptEntityValues.mockReturnValue(contents.slice(1));
      await expect(realmService.getRealmContentByIds(realm, ids)).rejects.toThrow();
      expect(mockCryptoService.decryptEntityValues).not.toHaveBeenCalled();
      expect(mockConfigRepo.where).toHaveBeenCalledWith({ realm, id: { $in: ids } });
    });
  });

  describe('deleteRealm', () => {
    const realm = 'exampleRealm';

    it('should delete a realm', async () => {
      mockConfigRepo.delete.mockReturnValue({ deletedCount: 1 });
      await realmService.deleteRealm(realm);
      expect(mockConfigRepo.delete).toHaveBeenCalledWith(realm);
    });
  });

  describe('deleteRealmContentByIds', () => {
    const realm = 'exampleRealm';
    const ids = ['1', '2'];

    it('should delete realm contents by ids', async () => {
      mockConfigRepo.delete.mockReturnValue({ deletedCount: 2 });
      await realmService.deleteRealmContentByIds(realm, ids);
      expect(mockConfigRepo.delete).toHaveBeenCalledWith(realm, ids);
    });
  });

  describe('countRealms', () => {
    it('should count the realms and return the amount', async () => {
      mockConfigRepo.countRealms.mockReturnValue(1);
      await realmService.countRealms();
      expect(mockConfigRepo.countRealms).toHaveBeenCalled();
    });
  });

  describe('countRealmContents', () => {
    it('should count the realm contents and return the amount', async () => {
      mockConfigRepo.countContents.mockReturnValue(1);
      await realmService.countRealmContents();
      expect(mockConfigRepo.countContents).toHaveBeenCalled();
    });
  });
});
