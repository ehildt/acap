import { Test } from '@nestjs/testing';

import { FILTER } from '@/models/filter.model';
import { GlobalConfigFactoryModule } from '@/modules/global-config-factory.module';
import { RealmRepository } from '@/repositories/realm.repository';
import { SchemaRepository } from '@/repositories/schema.repository';
import { JsonSchemaContentsDefinition } from '@/schemas/json-schema-content-definition.schema';
import { RealmContentsSchemaDefinition } from '@/schemas/realm-content-definition.schema';

import { CryptoService } from './crypto.service';
import { MetaService } from './meta.service';

const COOKIES_ARE_YUMMY = 'cookies are yummy';

describe('MetaService', () => {
  let metaService: MetaService;
  let realmRepositoryMock: Partial<RealmRepository>;
  let schemaRepositoryMock: Partial<SchemaRepository>;

  beforeEach(async () => {
    realmRepositoryMock = {
      find: jest.fn().mockResolvedValue(
        Promise.resolve<Array<RealmContentsSchemaDefinition>>([
          { id: '1234', realm: 'REALM', value: COOKIES_ARE_YUMMY },
          { id: '5678', realm: 'REALM', value: JSON.stringify({ test: 'successful' }) },
        ]),
      ),
      getMetaRealmsBySchemas: jest
        .fn()
        .mockResolvedValue(Promise.resolve([{ id: '1234', realm: 'SCHEMA', value: COOKIES_ARE_YUMMY }])),
      countRealms: jest.fn().mockResolvedValue(2),
    };

    schemaRepositoryMock = {
      find: jest.fn().mockResolvedValue(
        Promise.resolve<Array<JsonSchemaContentsDefinition>>([
          { id: '1234', realm: 'SCHEMA', value: COOKIES_ARE_YUMMY },
          { id: '5678', realm: 'SCHEMA', value: JSON.stringify({ test: 'successful' }) },
        ]),
      ),
      getMetaSchemasByRealms: jest
        .fn()
        .mockResolvedValue(Promise.resolve([{ id: '1234', realm: 'REALM', value: COOKIES_ARE_YUMMY }])),
      countSchemas: jest.fn().mockResolvedValue(2),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [GlobalConfigFactoryModule],
      providers: [
        MetaService,
        CryptoService,
        { provide: RealmRepository, useValue: realmRepositoryMock },
        { provide: SchemaRepository, useValue: schemaRepositoryMock },
      ],
    }).compile();

    metaService = moduleRef.get<MetaService>(MetaService);
  });

  describe('getRealmMeta', () => {
    it('should return realm metadata', async () => {
      const filter: FILTER = { skip: 0, take: 2 };
      const expectedData = {
        REALM: [
          {
            hasSchema: true,
            id: '1234',
            value: COOKIES_ARE_YUMMY,
          },
          {
            hasSchema: false,
            id: '5678',
            value: { test: 'successful' },
          },
        ],
      };

      const result = await metaService.getRealmMeta(filter);

      expect(realmRepositoryMock.find).toHaveBeenCalledWith(filter, expect.any(Array));
      expect(schemaRepositoryMock.getMetaSchemasByRealms).toHaveBeenCalledWith(expect.any(Array), expect.any(Array));
      expect(realmRepositoryMock.countRealms).toHaveBeenCalled();
      expect(result).toStrictEqual({ count: 2, data: expectedData });
    });
  });

  describe('getSchemaMeta', () => {
    it('should return schema metadata', async () => {
      const filter: FILTER = { skip: 0, take: 2 };
      const expectedData = {
        SCHEMA: [
          {
            hasRealm: true,
            id: '1234',
            value: COOKIES_ARE_YUMMY,
          },
          {
            hasRealm: false,
            id: '5678',
            value: { test: 'successful' },
          },
        ],
      };

      const result = await metaService.getSchemaMeta(filter);

      expect(schemaRepositoryMock.find).toHaveBeenCalledWith(filter, expect.any(Array));
      expect(realmRepositoryMock.getMetaRealmsBySchemas).toHaveBeenCalledWith(expect.any(Array), expect.any(Array));
      expect(schemaRepositoryMock.countSchemas).toHaveBeenCalled();
      expect(result).toStrictEqual({ count: 2, data: expectedData });
    });
  });
});
