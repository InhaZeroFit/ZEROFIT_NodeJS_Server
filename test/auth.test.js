/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-24
 */

const db = require('../models');
const dotenv = require('dotenv');
dotenv.config();

const request = require('supertest');
const app = `${process.env.TEST_SERVER_URL}`;

describe('Auth API Tests', () => {
  beforeAll(async () => {
    await db.sequelize.sync({force: true});
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  describe('POST /auth/join', () => {
    it('정상적인 회원가입', async () => {
      const request_body = {
        name: 'test',
        email: 'test@test.com',
        password: '12341234',
        address: 'South Korea',
      };

      const response = await request(app).post('/auth/join').send(request_body);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('회원가입이 정상적으로 성공했습니다!');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.name).toBe(request_body.name);
      expect(response.body.user.email).toBe(request_body.email);
      expect(response.body.user.address).toBe(request_body.address);
    });

    it('몇몇 필드값 누락', async () => {
      const request_body = {
        name: 'test',
        email: 'test@test.com',
        password: '12341234',
      };

      const response = await request(app).post('/auth/join').send(request_body);

      expect(response.status).toBe(400);
      expect(response.body.message)
          .toBe('필수적인 입력값이 누락: name or email or password or address');
    });

    it('이미 존재하는 이메일', async () => {
      const request_body = {
        name: 'test',
        email: 'test@test.com',
        password: '12341234',
        address: 'South Korea',
      };

      const response = await request(app).post('/auth/join').send(request_body);

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('이메일이 이미 존재합니다!');
    });
  });
});