/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-24
 */

// 1. Import modules
const jwt = require('jsonwebtoken');
const request = require('supertest');
const dotenv = require('dotenv');

// 2. Import custom modules
const db = require('../models');

// 3. Set environment variables
dotenv.config();

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
      expect(response.body.message).toBe('회원가입이 정상적으로 성공했습니다.');
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
          .toBe('요청 body에 일부 필드가 누락되었습니다.');
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
      expect(response.body.message).toBe('이메일이 이미 존재합니다.');
    });
  });

  describe('POST /auth/login', () => {
    it('정상적인 로그인', async () => {
      const request_body = {
        email: 'test@test.com',
        password: '12341234',
      };

      const response =
          await request(app).post('/auth/login').send(request_body);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.message).toBe('로그인 성공.');

      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
      expect(decoded).toHaveProperty('user_id');
    });

    it('존재하지 않는 이메일', async () => {
      const request_body = {email: 'test-test@test.com', password: '12341234'};

      const response =
          await request(app).post('/auth/login').send(request_body);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    it('일치하지 않는 비밀번호', async () => {
      const request_body = {email: 'test@test.com', password: '43214321'};

      const response =
          await request(app).post('/auth/login').send(request_body);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /auth/logout', () => {
    it('로그아웃 성공', async () => {
      const response = await request(app).get('/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('로그아웃 성공.');
    });
  });
});