import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Cache } from 'cache-manager';

import { ContentUpsertReq } from '@/dtos/content-upsert-req.dto';
import { AvjService } from '@/services/avj.service';
import { ConfigFactoryService } from '@/services/config-factory.service';
import { RealmService } from '@/services/realm.service';
import { SchemaService } from '@/services/schema.service';

import { RealmController } from './realm.controller';

const COOKIES_ARE_YUMMY: Array<ContentUpsertReq> = [{ id: 'COOKIES', value: 'are yummy' }];
const COOKIES_ARE_YUMMY_RESULT = { COOKIES: 'are yummy' };

describe('RealmController', () => {
  let controller: RealmController;
  let realmService: RealmService;
  let schemaService: SchemaService;
  let avjService: AvjService;
  let cache: Cache;
  let mockConfigFactory: Partial<ConfigFactoryService>;

  beforeEach(async () => {
    mockConfigFactory = {
      app: { realm: { namespacePostfix: 'TEST', resolveEnv: false, ttl: 360 } },
    } as Partial<ConfigFactoryService>;

    const moduleRef = await Test.createTestingModule({
      controllers: [RealmController],
      providers: [
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
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
          provide: RealmService,
          useValue: {
            getRealm: jest.fn().mockReturnValue(COOKIES_ARE_YUMMY),
            getRealmContentByIds: jest.fn().mockReturnValue(COOKIES_ARE_YUMMY_RESULT),
            countRealmContents: jest.fn(),
            upsertRealm: jest.fn(),
            deleteRealm: jest.fn(),
            deleteRealmContentByIds: jest.fn(),
          },
        },
        {
          provide: SchemaService,
          useValue: {
            getRealm: jest.fn(),
            getRealmContentByIds: jest.fn().mockReturnValue({}),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get<RealmController>(RealmController);
    realmService = moduleRef.get<RealmService>(RealmService);
    schemaService = moduleRef.get<SchemaService>(SchemaService);
    avjService = moduleRef.get<AvjService>(AvjService);
    cache = moduleRef.get<Cache>(CACHE_MANAGER);
  });

  describe('deleteRealm', () => {
    it('should call deleteRealm without ids', async () => {
      const realm = 'TEST';
      await controller.deleteRealm(realm);
      expect(cache.del).toHaveBeenCalledOnce();
      expect(realmService.deleteRealm).toHaveBeenCalledOnce();
      expect(cache.set).not.toHaveBeenCalled();
    });

    it('should call deleteRealm with ids', async () => {
      const realm = 'TEST';
      const ids = ['ONE', 'TWO'];
      await controller.deleteRealm(realm, ids);
      expect(realmService.deleteRealmContentByIds).toHaveBeenCalledOnce();
      expect(realmService.countRealmContents).toHaveBeenCalledOnce();
      expect(cache.del).toHaveBeenCalledOnce();
      expect(cache.set).not.toHaveBeenCalled();
    });

    it('should call deleteRealm with ids and remove the ids from cache', async () => {
      const realm = 'TEST';
      const ids = ['ONE', 'TWO'];
      realmService.countRealmContents = jest.fn().mockReturnValue(1);
      cache.get = jest.fn().mockReturnValue({ content: {} });
      await controller.deleteRealm(realm, ids);
      expect(realmService.deleteRealmContentByIds).toHaveBeenCalledOnce();
      expect(realmService.countRealmContents).toHaveBeenCalledOnce();
      expect(cache.set).toHaveBeenCalled();
      expect(cache.del).not.toHaveBeenCalled();
    });
  });

  describe('upsertRealms', () => {
    it('should call upsertRealms', async () => {
      const realm = 'TEST';
      cache.get = jest.fn().mockReturnValue({ content: COOKIES_ARE_YUMMY_RESULT });
      await controller.upsertRealms([
        {
          realm,
          contents: [
            { id: 'COOKIES', value: 'are yummy' },
            { id: 'FRUITS', value: 'are tasty' },
          ],
        },
      ]);
      expect(schemaService.getRealmContentByIds).toHaveBeenCalledWith(realm, ['COOKIES', 'FRUITS'], false);
      expect(avjService.compile).toHaveBeenCalledTimes(2);
      expect(avjService.validate).toHaveBeenCalledTimes(2);
      expect(realmService.upsertRealm).toHaveBeenCalledWith(realm, [
        { id: 'COOKIES', value: 'are yummy' },
        { id: 'FRUITS', value: 'are tasty' },
      ]);
      expect(realmService.countRealmContents).toHaveBeenCalledOnce();
      expect(cache.get).toHaveBeenCalledOnce();
      expect(cache.set).toHaveBeenCalledOnce();
    });
  });

  describe('upsertRealm', () => {
    it('should call upsertRealm with a realm and Array<ContentUpsertReq>, cached', async () => {
      const realm = 'TEST';
      cache.get = jest.fn().mockReturnValue({ content: COOKIES_ARE_YUMMY_RESULT });
      await controller.upsertRealm(realm, COOKIES_ARE_YUMMY);
      expect(schemaService.getRealmContentByIds).toHaveBeenCalledWith(realm, ['COOKIES'], false);
      expect(avjService.compile).toHaveBeenCalledOnce();
      expect(avjService.validate).toHaveBeenCalledOnce();
      expect(realmService.upsertRealm).toHaveBeenCalledWith(realm, COOKIES_ARE_YUMMY);
      expect(realmService.countRealmContents).toHaveBeenCalledOnce();
      expect(cache.get).toHaveBeenCalledOnce();
      expect(cache.set).toHaveBeenCalledOnce();
    });

    it('should call upsertRealm with a realm and Array<ContentUpsertReq>, not cached', async () => {
      const realm = 'TEST';
      await controller.upsertRealm(realm, COOKIES_ARE_YUMMY);
      expect(schemaService.getRealmContentByIds).toHaveBeenCalledWith(realm, ['COOKIES'], false);
      expect(avjService.compile).toHaveBeenCalledOnce();
      expect(avjService.validate).toHaveBeenCalledOnce();
      expect(realmService.upsertRealm).toHaveBeenCalledWith(realm, COOKIES_ARE_YUMMY);
      expect(cache.get).toHaveBeenCalledOnce();
    });

    it('should throw if  schema validation fails', async () => {
      const realm = 'TEST';
      const COOKIES = 'COOKIES';
      schemaService.getRealmContentByIds = jest.fn().mockReturnValue({});

      try {
        await controller.upsertRealm(realm, COOKIES_ARE_YUMMY);
      } catch (error) {
        expect(error).toEqual(
          new UnprocessableEntityException(`Cannot read properties of undefined (reading '${COOKIES}')`),
        );
      }
    });
  });

  describe('getRealmContent', () => {
    it('should call getRealmContent with a realm and a content id', async () => {
      const realm = 'TEST';
      const contentId = 'COOKIES';
      const data = await controller.getRealmContent(realm, contentId);
      expect(data).toEqual(COOKIES_ARE_YUMMY_RESULT.COOKIES);
      expect(cache.get).toHaveBeenCalledOnce();
      expect(cache.set).toHaveBeenCalledOnce();
    });

    it('should call getRealmContent with a cached content id', async () => {
      const realm = 'TEST';
      const contentId = 'COOKIES';
      cache.get = jest.fn().mockReturnValue({ content: COOKIES_ARE_YUMMY_RESULT });
      const data = await controller.getRealmContent(realm, contentId);
      expect(data).toEqual(COOKIES_ARE_YUMMY_RESULT.COOKIES);
      expect(cache.get).toHaveBeenCalledOnce();
      expect(cache.set).toHaveBeenCalledWith('$REALM:TEST @TEST', { content: { COOKIES: 'are yummy' } }, 360);
    });

    it('should throw if id not exists on the realm', async () => {
      const realm = 'TEST';
      const contentId = 'SODA';

      try {
        await controller.getRealmContent(realm, contentId);
      } catch (error) {
        expect(error).toEqual(new NotFoundException(`No such ID::${contentId} on REALM::${realm}`));
      }

      expect(cache.get).toHaveBeenCalledOnce();
    });
  });

  describe('getRealm', () => {
    it('should call getRealm with a realm and content ids', async () => {
      const realm = 'TEST';
      const contentIds = ['COOKIES'];
      const data = await controller.getRealm(realm, contentIds);
      expect(data).toEqual(COOKIES_ARE_YUMMY_RESULT);
      expect(cache.get).toHaveBeenCalledOnce();
      expect(cache.set).toHaveBeenCalledOnce();
    });

    it('should call getRealm without content ids', async () => {
      const realm = 'TEST';
      const data = await controller.getRealm(realm);
      expect(data).toEqual(COOKIES_ARE_YUMMY_RESULT);
      expect(realmService.getRealm).toHaveBeenCalledWith(realm);
      expect(cache.get).toHaveBeenCalledOnce();
      expect(cache.set).toHaveBeenCalledOnce();
    });

    it('should throw if a realm does not exist', async () => {
      const realm = 'TEST';
      realmService.getRealm = jest.fn().mockReturnValue([]);

      try {
        await controller.getRealm(realm);
      } catch (error) {
        expect(error).toEqual(new NotFoundException(`No such REALM::${realm}`));
      }

      expect(realmService.getRealm).toHaveBeenCalledWith(realm);
      expect(cache.get).toHaveBeenCalledOnce();
    });
  });
});
