import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Cache } from 'cache-manager';

import { ContentUpsertReq } from '@/dtos/content-upsert-req.dto';
import { AvjService } from '@/services/avj.service';
import { ConfigFactoryService } from '@/services/config-factory.service';
import { SchemaService } from '@/services/schema.service';

import { JsonSchemaController } from './json-schema.controller';

const COOKIES_ARE_YUMMY: Array<ContentUpsertReq> = [{ id: 'COOKIES', value: 'are yummy' }];
const COOKIES_ARE_YUMMY_RESULT = { COOKIES: 'are yummy' };

describe('JsonSchemaController', () => {
  let controller: JsonSchemaController;
  let schemaService: SchemaService;
  let avjService: AvjService;
  let mockCache: Partial<Cache>;
  let mockConfigFactory: Partial<ConfigFactoryService>;

  beforeEach(async () => {
    mockConfigFactory = {
      app: { realm: { namespacePostfix: 'TEST', resolveEnv: false, ttl: 360 } },
    } as Partial<ConfigFactoryService>;

    mockCache = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    } as Partial<Cache>;

    const moduleRef = await Test.createTestingModule({
      controllers: [JsonSchemaController],
      providers: [
        {
          provide: CACHE_MANAGER,
          useValue: mockCache,
        },
        {
          provide: AvjService,
          useValue: {
            compile: jest.fn(),
            validate: jest.fn(),
          },
        },
        {
          provide: ConfigFactoryService,
          useValue: mockConfigFactory,
        },
        {
          provide: SchemaService,
          useValue: {
            upsertRealm: jest.fn(),
            getRealm: jest.fn().mockReturnValue(COOKIES_ARE_YUMMY),
            getRealmContentByIds: jest.fn().mockReturnValue({}),
            deleteRealm: jest.fn(),
            deleteRealmContentByIds: jest.fn(),
            countRealmContents: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get<JsonSchemaController>(JsonSchemaController);
    schemaService = moduleRef.get<SchemaService>(SchemaService);
    avjService = moduleRef.get<AvjService>(AvjService);
    mockCache = moduleRef.get<Cache>(CACHE_MANAGER);
  });

  describe('upsertSchemas', () => {
    it('should call upsertSchema with a realm and contentUpsertReq', async () => {
      const realm = 'TEST';
      mockCache.get = jest.fn().mockReturnValue({ content: COOKIES_ARE_YUMMY_RESULT });
      await controller.upsertSchemas([
        {
          realm,
          contents: [
            { id: 'COOKIES', value: 'are yummy' },
            { id: 'FRUITS', value: 'are tasty' },
          ],
        },
      ]);

      expect(avjService.compile).toHaveBeenCalledTimes(2);
      expect(schemaService.upsertRealm).toHaveBeenCalledWith(realm, [
        { id: 'COOKIES', value: 'are yummy' },
        { id: 'FRUITS', value: 'are tasty' },
      ]);
      expect(schemaService.countRealmContents).toHaveBeenCalledOnce();
      expect(mockCache.get).toHaveBeenCalledOnce();
      expect(mockCache.set).toHaveBeenCalledOnce();
    });
  });

  describe('upsertSchema', () => {
    it('should call upsertSchema with a realm and contentUpsertReq', async () => {
      const realm = 'TEST';
      await controller.upsertSchema(realm, COOKIES_ARE_YUMMY);
      expect(mockCache.get).toHaveBeenCalledOnce();
    });

    it('should call upsertSchema with a realm and contentUpsertReq, and update the cache', async () => {
      const realm = 'TEST';
      mockCache.get = jest.fn().mockReturnValue({ content: COOKIES_ARE_YUMMY_RESULT, count: 1 });
      await controller.upsertSchema(realm, COOKIES_ARE_YUMMY);
      expect(mockCache.get).toHaveBeenCalledOnce();
      expect(schemaService.countRealmContents).toHaveBeenCalledOnce();
      expect(mockCache.set).toHaveBeenCalledOnce();
    });

    it('should throw if schema validation fails', async () => {
      const realm = 'TEST';
      mockCache.get = jest.fn().mockReturnValue({ content: COOKIES_ARE_YUMMY_RESULT, count: 1 });
      avjService.compile = jest.fn().mockImplementation((val) => {
        throw Error(val);
      });
      await controller.upsertSchema(realm, COOKIES_ARE_YUMMY);
      expect(mockCache.get).toHaveBeenCalledOnce();
      expect(schemaService.countRealmContents).toHaveBeenCalledOnce();
      expect(mockCache.set).toHaveBeenCalledOnce();
    });
  });

  describe('getRealmContent', () => {
    it('should call getRealmContent with a realm and content id, cached', async () => {
      const realm = 'TEST';
      const contentId = 'COOKIES';
      mockCache.get = jest.fn().mockReturnValue({ content: COOKIES_ARE_YUMMY_RESULT, count: 1 });
      const data = await controller.getRealmContent(realm, contentId);
      expect(data).toEqual(COOKIES_ARE_YUMMY_RESULT.COOKIES);
      expect(mockCache.get).toHaveBeenCalledOnce();
      expect(mockCache.set).toHaveBeenCalledOnce();
    });

    it('should call getRealmContent with a realm and content id, uncached', async () => {
      const realm = 'TEST';
      const contentId = 'COOKIES';
      schemaService.getRealmContentByIds = jest.fn().mockReturnValue(COOKIES_ARE_YUMMY_RESULT);
      const data = await controller.getRealmContent(realm, contentId);
      expect(data).toEqual(COOKIES_ARE_YUMMY_RESULT.COOKIES);
      expect(schemaService.countRealmContents).toHaveBeenCalled();
      expect(schemaService.getRealmContentByIds).toHaveBeenCalledWith(realm, [contentId]);
      expect(mockCache.get).toHaveBeenCalledOnce();
      expect(mockCache.set).toHaveBeenCalledOnce();
    });

    it('should throw if content id does not exist', async () => {
      const realm = 'TEST';
      const contentId = 'COOKIES';

      try {
        await controller.getRealmContent(realm, contentId);
      } catch (error) {
        expect(error).toEqual(new NotFoundException(`No such ID::${contentId} on REALM::${realm}`));
      }

      expect(schemaService.countRealmContents).toHaveBeenCalled();
      expect(schemaService.getRealmContentByIds).toHaveBeenCalledWith(realm, [contentId]);
      expect(mockCache.get).toHaveBeenCalledOnce();
    });
  });

  describe('getRealm', () => {
    it('should call getRealm with a realm and content ids, cached, odd', async () => {
      const realm = 'TEST';
      const contentIds = ['COOKIES'];
      mockCache.get = jest.fn().mockReturnValue({ content: COOKIES_ARE_YUMMY_RESULT, count: 1 });
      const data = await controller.getRealm(realm, contentIds);
      expect(data).toEqual(COOKIES_ARE_YUMMY_RESULT);
      expect(mockCache.get).toHaveBeenCalledOnce();
      expect(mockCache.set).toHaveBeenCalledOnce();
    });

    it('should call getRealm with a realm and content ids, un-cached', async () => {
      const realm = 'TEST';
      const contentIds = ['COOKIES', 'UNCACHED'];
      mockCache.get = jest.fn().mockReturnValue({ content: COOKIES_ARE_YUMMY_RESULT, count: 1 });
      schemaService.getRealmContentByIds = jest.fn().mockReturnValue({ UNCACHED: 'candy' });
      const data = await controller.getRealm(realm, contentIds);
      expect(data).toEqual({ COOKIES: 'are yummy', UNCACHED: 'candy' });
      expect(mockCache.get).toHaveBeenCalledOnce();
      expect(mockCache.set).toHaveBeenCalledOnce();
      expect(schemaService.getRealmContentByIds).toHaveBeenCalled();
      expect(schemaService.countRealmContents).toHaveBeenCalled();
    });

    it('should call getRealm without content ids', async () => {
      const realm = 'TEST';
      const data = await controller.getRealm(realm);
      expect(data).toEqual(COOKIES_ARE_YUMMY_RESULT);
      expect(schemaService.getRealm).toHaveBeenCalledWith(realm);
      expect(mockCache.get).toHaveBeenCalledOnce();
      expect(mockCache.set).toHaveBeenCalledOnce();
    });

    it('should call getRealm without content ids, cached, matching the content ids', async () => {
      const realm = 'TEST';
      mockCache.get = jest.fn().mockReturnValue({ content: COOKIES_ARE_YUMMY_RESULT, count: 2 });
      const data = await controller.getRealm(realm);
      expect(data).toEqual(COOKIES_ARE_YUMMY_RESULT);
      expect(schemaService.getRealm).toHaveBeenCalled();
      expect(mockCache.get).toHaveBeenCalledOnce();
      expect(mockCache.set).toHaveBeenCalledOnce();
    });

    it('should throw if a realm does not exist', async () => {
      const realm = 'TEST';
      schemaService.getRealm = jest.fn().mockReturnValue([]);

      try {
        await controller.getRealm(realm);
      } catch (error) {
        expect(error).toEqual(new NotFoundException(`No such REALM::${realm}`));
      }

      expect(schemaService.getRealm).toHaveBeenCalledWith(realm);
      expect(mockCache.get).toHaveBeenCalledOnce();
    });
  });

  describe('deleteRealm', () => {
    it('should call deleteRealm without ids', async () => {
      const realm = 'TEST';
      await controller.deleteRealm(realm);
      expect(mockCache.del).toHaveBeenCalledOnce();
      expect(schemaService.deleteRealm).toHaveBeenCalledOnce();
      expect(mockCache.set).not.toHaveBeenCalled();
    });

    it('should call deleteRealm with ids', async () => {
      const realm = 'TEST';
      const ids = ['ONE', 'TWO'];
      await controller.deleteRealm(realm, ids);
      expect(schemaService.deleteRealmContentByIds).toHaveBeenCalledOnce();
      expect(schemaService.countRealmContents).toHaveBeenCalledOnce();
      expect(mockCache.del).toHaveBeenCalledOnce();
      expect(mockCache.set).not.toHaveBeenCalled();
    });

    it('should call deleteRealm with ids and remove the ids from cache', async () => {
      const realm = 'TEST';
      const ids = ['ONE', 'TWO'];
      schemaService.countRealmContents = jest.fn().mockReturnValue(1);
      mockCache.get = jest.fn().mockReturnValue({ content: {} });
      await controller.deleteRealm(realm, ids);
      expect(schemaService.deleteRealmContentByIds).toHaveBeenCalledOnce();
      expect(schemaService.countRealmContents).toHaveBeenCalledOnce();
      expect(mockCache.set).toHaveBeenCalled();
      expect(mockCache.del).not.toHaveBeenCalled();
    });
  });
});
