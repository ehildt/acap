import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/modules/app.module';

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>();
    await app.init();
  });

  afterEach(async () => {
    await app?.close();
  });

  it('/ (GET)', async () => {
    return await request(app.getHttpServer()).get('http://localhost:3001/api/v1/configs?take=1&skip=0').expect(200);
  });
});
