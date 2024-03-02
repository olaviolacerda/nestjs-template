import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestingModule, Test } from '@nestjs/testing';

import { AppModule } from '../../src/core/modules/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('it should login a valid user', () => {
    const credentials = {
      username: 'test',
      password: '123',
    };

    return request(app.getHttpServer())
      .post(`/auth/login`)
      .send(credentials)
      .expect(({ body }: request.Response) => {
        expect(body).toBeDefined();
        expect(body['accessToken']).toBeDefined();
        expect(body['refreshToken']).toBeDefined();
      })
      .expect(HttpStatus.OK);
  });

  it('it should NOT login a user with invalid password', () => {
    const credentials = {
      username: 'test',
      password: 'fakepass',
    };

    return request(app.getHttpServer())
      .post(`/auth/login`)
      .send(credentials)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('it should NOT login an user if it not exists', () => {
    const credentials = {
      username: 'idonotexist',
      password: '123',
    };

    return request(app.getHttpServer())
      .post(`/auth/login`)
      .send(credentials)
      .expect(({ body }: request.Response) => {
        expect(body).toBeDefined();
        expect(body.message).toBe('Something is wrong with your credentials');
      })
      .expect(HttpStatus.BAD_REQUEST);
  });
});
