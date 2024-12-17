/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-16
 */

const db = require('../models');
const dotenv = require('dotenv');
dotenv.config();

const request = require('supertest');  // Supertest for HTTP requests
const app = `${process.env.TEST_SERVER_URL}`;

describe('Wishlist API Tests', () => {
  let token;
  let userId;

  beforeAll(async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'discafile@naver.com',
      password: '1111',
    });

    token = res.body.token;
    userId = res.body.userId;

    // 응답이 올바른지 확인
    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    // 테스트 종료 후 DB 정리
    await db.sequelize.close();
  });

  test('POST /wishlist/add - Add item to wishlist', async () => {
    const res = await request(app)
                    .post('/wishlist/add')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                      userId: 1,
                      clothes_id: 3,
                    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Item added to wishlist.');
  });

  test('GET /wishlist/info - Retrieve wishlist', async () => {
    const res = await request(app)
                    .get('/wishlist/info')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                      userId: 1,
                    });

    expect(res.status).toBe(200);
    expect(res.body.clothes).toBeInstanceOf(Array);  // clothes는 배열이어야
    함
  });
});