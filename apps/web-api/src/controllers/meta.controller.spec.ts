import { Test } from '@nestjs/testing';

import { MetaService } from '@/services/meta.service';

import { MetaController } from './meta.controller';

describe('MetaController', () => {
  let controller: MetaController;
  let service: MetaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MetaController],
      providers: [
        {
          provide: MetaService,
          useValue: {
            getRealmMeta: jest.fn(),
            getSchemaMeta: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get<MetaController>(MetaController);
    service = moduleRef.get<MetaService>(MetaService);
  });

  describe('getRealmMeta', () => {
    it('should call metaService.getRealmMeta when metaSource is "realms"', async () => {
      const verbose = true;
      const take = 10;
      const skip = 0;
      const search = 'example';
      await controller.getRealmMeta('realms', verbose, take, skip, search);
      expect(service.getRealmMeta).toHaveBeenCalledWith({ take, skip, verbose, search });
    });

    it('should call metaService.getSchemaMeta when metaSource is "schemas"', async () => {
      const verbose = false;
      const take = 20;
      const skip = 5;
      const search = 'example';
      await controller.getRealmMeta('schemas', verbose, take, skip, search);
      expect(service.getSchemaMeta).toHaveBeenCalledWith({ take, skip, verbose, search });
    });
  });
});
