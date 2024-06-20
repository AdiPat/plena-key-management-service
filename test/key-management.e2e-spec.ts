import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/core/app.module';
import { generateJWT } from './test-utils';

describe('KeyManagement API (e2e)', () => {
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

  it('/keys/ (POST): generates API key successfully', async () => {
    const token = generateJWT();

    // create user first
    await request(app.getHttpServer())
      .post('/keys/user/register')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.CREATED);

    return request(app.getHttpServer())
      .post('/keys/')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        if (!(res.body.accessKey && res.body.rateLimits)) {
          throw new Error('missing accessKey or rateLimits');
        }
      });
  });

  it('/keys/all (GET): lists all created keys', async () => {
    const token = generateJWT();

    await request(app.getHttpServer())
      .post('/keys/user/register')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.CREATED);

    await request(app.getHttpServer())
      .post('/keys/')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        if (!(res.body.accessKey && res.body.rateLimits)) {
          throw new Error('missing accessKey or rateLimits');
        }
      });

    const response = await request(app.getHttpServer())
      .post('/keys/')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        if (!(res.body.accessKey && res.body.rateLimits)) {
          throw new Error('missing accessKey or rateLimits');
        }
      });

    const accessKey = response.body.accessKey;

    return request(app.getHttpServer())
      .get('/keys/all')
      .set('x-api-key', `${accessKey.key}`)
      .expect(HttpStatus.OK)
      .expect((res) => {
        if (res.body.length != 2) {
          throw new Error('failed to list all access keys');
        }
      });
  });

  it('/keys/:keyId/rate-limit (POST): updates rate limits', async () => {
    const token = generateJWT();

    await request(app.getHttpServer())
      .post('/keys/user/register')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.CREATED);

    const response = await request(app.getHttpServer())
      .post('/keys/')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        if (!(res.body.accessKey && res.body.rateLimits)) {
          throw new Error('missing accessKey or rateLimits');
        }
      });

    const accessKey = response.body.accessKey;

    return request(app.getHttpServer())
      .post(`/keys/${accessKey.id}/rate-limit`)
      .set('x-api-key', `${accessKey.key}`)
      .send({ limit: 100 })
      .expect(HttpStatus.OK);
  });

  it('/keys/:keyId/rate-limit (POST): returns bad request if keyId or limit is missing', async () => {
    const token = generateJWT();

    await request(app.getHttpServer())
      .post('/keys/user/register')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.CREATED);

    const response = await request(app.getHttpServer())
      .post('/keys/')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        if (!(res.body.accessKey && res.body.rateLimits)) {
          throw new Error('missing accessKey or rateLimits');
        }
      });

    const accessKey = response.body.accessKey;

    return request(app.getHttpServer())
      .post(`/keys/${accessKey.id}/rate-limit`)
      .set('x-api-key', `${accessKey.key}`)
      .send({ limit: 0 })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/keys/:keyId/expiry (POST): updates expiry', async () => {
    const token = generateJWT();

    await request(app.getHttpServer())
      .post('/keys/user/register')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.CREATED);

    const response = await request(app.getHttpServer())
      .post('/keys/')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        if (!(res.body.accessKey && res.body.rateLimits)) {
          throw new Error('missing accessKey or rateLimits');
        }
      });

    const accessKey = response.body.accessKey;

    return request(app.getHttpServer())
      .post(`/keys/${accessKey.id}/expiry`)
      .set('x-api-key', `${accessKey.key}`)
      .send({ expiry: new Date() })
      .expect(HttpStatus.OK);
  });

  it('/keys/:keyId/revoke (POST): revokes key', async () => {
    const token = generateJWT();

    await request(app.getHttpServer())
      .post('/keys/user/register')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.CREATED);

    const response = await request(app.getHttpServer())
      .post('/keys/')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        if (!(res.body.accessKey && res.body.rateLimits)) {
          throw new Error('missing accessKey or rateLimits');
        }
      });

    const accessKey = response.body.accessKey;

    return request(app.getHttpServer())
      .post(`/keys/${accessKey.id}/revoke`)
      .set('x-api-key', `${accessKey.key}`)
      .expect(HttpStatus.OK);
  });
});
