import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/core/app.module';
import { generateJWT } from './test-utils';

describe('KeyManagementController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/keys/user/register (POST): registers user', () => {
    const token = generateJWT();

    return request(app.getHttpServer())
      .post('/keys/user/register')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.CREATED);
  });

  it('/keys/user/register (POST): returns unauthorized if auth header is absent', () => {
    return request(app.getHttpServer())
      .post('/keys/user/register')
      .expect(HttpStatus.UNAUTHORIZED);
  });
});
