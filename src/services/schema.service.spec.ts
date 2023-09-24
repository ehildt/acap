import { Test, TestingModule } from '@nestjs/testing';

import { SchemaRepository } from '@/repositories/schema.repository';

import { ConfigFactoryService } from './config-factory.service';
import { SchemaService } from './schema.service';

const mockConfigRepo = {
  upsert: jest.fn().mockReturnValue({ ok: true }),
  upsertMany: jest.fn().mockReturnValue({ ok: true }),
  where: jest.fn(),
  delete: jest.fn(),
  countContents: jest.fn(),
  countSchemas: jest.fn(),
};

const mockFactory = {
  app: {
    realm: {
      resolveEnv: jest.fn(),
    },
  },
};

describe('SchemaService', () => {
  let schemaService: SchemaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchemaService,
        { provide: SchemaRepository, useValue: mockConfigRepo },
        { provide: ConfigFactoryService, useValue: mockFactory },
      ],
    }).compile();

    schemaService = module.get<SchemaService>(SchemaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upsertRealm', () => {
    const realm = 'exampleRealm';
    const reqs = [{ id: '1', value: 'one' }];

    it('should successfully upsert a realm', async () => {
      await schemaService.upsertRealm(realm, reqs);
      expect(mockConfigRepo.upsert).toHaveBeenCalledWith(realm, reqs);
    });

    it('should throw an error if the realm upsert failed', async () => {
      mockConfigRepo.upsert.mockReturnValue({ ok: false });
      await expect(schemaService.upsertRealm(realm, reqs)).rejects.toThrow();
      expect(mockConfigRepo.upsert).toHaveBeenCalledWith(realm, reqs);
    });
  });

  describe('upsertRealms', () => {
    const realm = 'exampleRealm';
    const contents = [{ id: '1', value: 'one' }];
    const reqs = [{ realm, contents }];

    it('should successfully upsert realms', async () => {
      await schemaService.upsertRealms(reqs);
      expect(mockConfigRepo.upsertMany).toHaveBeenCalledWith(reqs);
    });

    it('should throw an error if upserting multiple realms failed', async () => {
      mockConfigRepo.upsertMany.mockReturnValue({ ok: false });
      await expect(schemaService.upsertRealms(reqs)).rejects.toThrow();
      expect(mockConfigRepo.upsertMany).toHaveBeenCalledWith(reqs);
    });
  });

  describe('getRealm', () => {
    const realm = 'exampleRealm';
    const contents = [{ id: '1', value: 'one' }];

    it('should return a realm', async () => {
      mockConfigRepo.where.mockReturnValue(contents);
      await schemaService.getRealm(realm);
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

    it('should return realm content by ids', async () => {
      mockConfigRepo.where.mockReturnValue(contents);
      await schemaService.getRealmContentByIds(realm, ids);
      expect(mockConfigRepo.where).toHaveBeenCalledWith({ realm, id: { $in: ids } });
    });

    it('should throw if not all ids can be fetched', async () => {
      mockConfigRepo.where.mockReturnValue(contents.slice(1));
      await expect(schemaService.getRealmContentByIds(realm, ids)).rejects.toThrow();
      expect(mockConfigRepo.where).toHaveBeenCalledWith({ realm, id: { $in: ids } });
    });
  });

  describe('deleteRealm', () => {
    const realm = 'exampleRealm';

    it('should delete a realm', async () => {
      mockConfigRepo.delete.mockReturnValue({ deletedCount: 1 });
      await schemaService.deleteRealm(realm);
      expect(mockConfigRepo.delete).toHaveBeenCalledWith(realm);
    });

    it('should throw if delete fails', async () => {
      mockConfigRepo.delete.mockReturnValue({ deletedCount: 0 });
      await expect(schemaService.deleteRealm(realm)).rejects.toThrow();
      expect(mockConfigRepo.delete).toHaveBeenCalledWith(realm);
    });
  });

  describe('deleteRealmContentByIds', () => {
    const realm = 'exampleRealm';
    const ids = ['1', '2'];

    it('should delete realm contents by ids', async () => {
      mockConfigRepo.delete.mockReturnValue({ deletedCount: 2 });
      await schemaService.deleteRealmContentByIds(realm, ids);
      expect(mockConfigRepo.delete).toHaveBeenCalledWith(realm, ids);
    });

    it('should throw if delete fails', async () => {
      mockConfigRepo.delete.mockReturnValue({ deletedCount: 0 });
      await expect(schemaService.deleteRealmContentByIds(realm, ids)).rejects.toThrow();
      expect(mockConfigRepo.delete).toHaveBeenCalledWith(realm, ids);
    });
  });

  describe('countSchemas', () => {
    it('should count the realms and return the amount', async () => {
      mockConfigRepo.countSchemas.mockReturnValue(1);
      await schemaService.countSchemas();
      expect(mockConfigRepo.countSchemas).toHaveBeenCalled();
    });
  });

  describe('countRealmContents', () => {
    it('should count the realm contents and return the amount', async () => {
      mockConfigRepo.countContents.mockReturnValue(1);
      await schemaService.countRealmContents();
      expect(mockConfigRepo.countContents).toHaveBeenCalled();
    });
  });
});
