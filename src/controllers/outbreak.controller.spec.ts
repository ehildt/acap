import { Test } from '@nestjs/testing';

import { BreakoutUpsertReq } from '@/dtos/breakout-upsert.dto.req';
import { OutbreakService } from '@/services/outbreak.service';

import { OutbreakController } from './outbreak.controller';

describe('OutbreakController', () => {
  let controller: OutbreakController;
  let service: OutbreakService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [OutbreakController],
      providers: [{ provide: OutbreakService, useValue: { delegate: jest.fn() } }],
    }).compile();

    controller = moduleRef.get<OutbreakController>(OutbreakController);
    service = moduleRef.get<OutbreakService>(OutbreakService);
  });

  describe('delegate', () => {
    it('should call outbreakService.delegate with the correct arguments', async () => {
      const reqs: Array<BreakoutUpsertReq> = [{ realm: 'TEST', contents: [{ content: 'do-test' }] }];
      const useMQTT = false;
      const useBullMQ = false;
      const useRedisPubSub = false;
      const result = await controller.delegate(reqs, useMQTT, useBullMQ, useRedisPubSub);
      expect(service.delegate).not.toHaveBeenCalledWith(reqs, { useBullMQ, useMQTT, useRedisPubSub });
      expect(result).toEqual(undefined);
    });

    it('should call outbreakService.delegate multiple times', async () => {
      const reqs: Array<BreakoutUpsertReq> = [{ realm: 'TEST', contents: [{ content: 'do-test' }] }];
      const useMQTT = true;
      const useBullMQ = true;
      const useRedisPubSub = true;
      const result = await controller.delegate(reqs, useMQTT, useBullMQ, useRedisPubSub);
      expect(service.delegate).toHaveBeenCalledWith(reqs, { useBullMQ, useMQTT, useRedisPubSub });
      expect(result).toEqual(undefined);
    });
  });
});
