import { ClientProxy } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { Queue } from 'bullmq';

import { AppConfigServices } from '@/configs/config-yml/config.model';
import { BULLMQ_REALMS_QUEUE, REDIS_PUBSUB } from '@/constants/app.constants';
import { BreakoutUpsertReq } from '@/dtos/breakout-upsert.dto.req';
import { MQTT_CLIENT, MqttClient } from '@/modules/mqtt-client.module';

import { ConfigFactoryService } from './config-factory.service';
import { OutbreakService } from './outbreak.service';

const mockFactory = {
  app: {
    channel: {
      resolveEnv: false,
    },
    services: {
      useBullMQ: true,
      useRedisPubSub: true,
      useMQTT: true,
    },
  },
};

describe('OutbreakService', () => {
  let outbreakService: OutbreakService;
  let mockRedisPubSub: jest.Mocked<ClientProxy>;
  let mockMQTTClient: jest.Mocked<MqttClient>;
  let mockBullMQQueue: jest.Mocked<Queue>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        OutbreakService,
        { provide: ConfigFactoryService, useValue: mockFactory },
        {
          provide: REDIS_PUBSUB,
          useValue: {
            emit: jest.fn(),
          },
        },
        {
          provide: MQTT_CLIENT,
          useValue: {
            publish: jest.fn(),
          },
        },
        {
          provide: BULLMQ_REALMS_QUEUE,
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    outbreakService = moduleRef.get<OutbreakService>(OutbreakService);
    mockRedisPubSub = moduleRef.get(REDIS_PUBSUB);
    mockMQTTClient = moduleRef.get(MQTT_CLIENT);
    mockBullMQQueue = moduleRef.get(BULLMQ_REALMS_QUEUE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('delegate', () => {
    it('should distribute data to realms using enabled messaging options', async () => {
      const reqs: BreakoutUpsertReq[] = [
        {
          channel: 'realm1',
          jobs: [
            {
              job: 'value1',
            },
          ],
        },
        {
          channel: 'realm2',
          jobs: [
            {
              job: 'value2',
            },
          ],
        },
      ];

      const args: AppConfigServices = {
        useRedisPubSub: true,
        useMQTT: true,
        useBullMQ: true,
      };

      await outbreakService.delegate(reqs, args);
      expect(mockRedisPubSub.emit).toHaveBeenCalledTimes(2);
      expect(mockMQTTClient.publish).toHaveBeenCalledTimes(2);
      // this one is un-mockable
      expect(mockBullMQQueue.add).not.toHaveBeenCalled();
    });

    it('should not distribute data if no messaging options are enabled', async () => {
      const reqs: BreakoutUpsertReq[] = [
        {
          channel: 'realm1',
          jobs: [
            {
              job: 'value1',
            },
          ],
        },
      ];

      const args: AppConfigServices = {
        useRedisPubSub: false,
        useMQTT: false,
        useBullMQ: false,
      };

      await outbreakService.delegate(reqs, args);
      expect(mockRedisPubSub.emit).not.toHaveBeenCalled();
      expect(mockMQTTClient.publish).not.toHaveBeenCalled();
      expect(mockBullMQQueue.add).not.toHaveBeenCalled();
    });
  });
});
