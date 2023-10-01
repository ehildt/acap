import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/modules/app.module';

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
  });

  afterEach(async () => {
    await app?.close();
  });

  it('/api/v1/metae (GET)', async () => {
    await request(app.getHttpServer()).get('/api/v1/metae?source=realms&take=1&skip=0&verbose=false').expect(200);
  });
});
