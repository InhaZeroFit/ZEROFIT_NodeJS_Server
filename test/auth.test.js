/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-16
 */

const jwt = require('jsonwebtoken');
const db = require('../models');
const dotenv = require('dotenv');
dotenv.config();

const request = require('supertest');
const app = `${process.env.TEST_SERVER_URL}`;

describe('Auth API Tests', () => {
  beforeAll(async () => {
    // 테스트 전 DB 초기화
    await db.sequelize.sync({force: true});
  });

  afterAll(async () => {
    // 테스트 종료 후 DB 정리
    await db.sequelize.close();
  });

  describe('POST /auth/join', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        nick: '길동이 나선다',
        password: 'password123',
        phone_number: '01012345678',
        name: '홍길동',
        gender: 'Male',
        address: '서울시 영등포구 양평동 3가 현대 2차아파트',
        payment: 'Kakao pay',
      };
      const response = await request(app).post('/auth/join').send(userData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User created successfully');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.nick).toBe(userData.nick);
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app).post('/auth/join').send({
        email: 'unknowned@example.com',
      });

      expect(response.status).toBe(400);
      expect(response.body.message)
          .toBe(
              'Required fields are missing: email, password, phone_number, or name');
    });

    it('should return 409 if email already exists', async () => {
      const userData = {
        email: 'test@example.com',
        nick: '길동이 나선다',
        password: 'password123',
        phone_number: '01012345678',
        name: '홍길동',
        gender: 'Male',
        address: '서울시 영등포구 양평동 3가 현대 2차아파트',
        payment: 'Kakao pay',
      };

      const response = await request(app).post('/auth/join').send(userData);

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('Email already exists');
    });
  });

  describe('POST /auth/login', () => {
    it('should log in a user and return a JWT token', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app).post('/auth/login').send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.message).toBe('Login successful');

      // Verify JWT token
      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
      expect(decoded).toHaveProperty('user_id');
    });

    it('should return 401 for invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app).post('/auth/login').send(loginData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });
  });
});