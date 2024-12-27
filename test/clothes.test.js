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
const {ImageToBase64} = require('../controllers/utils/file_utils');

// 3. Set environment variables
dotenv.config();

const app = `${process.env.TEST_SERVER_URL}`;

describe('Clothes API Tests', () => {
  beforeAll(async () => {
    await db.sequelize.sync({force: true});
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  let cloth_image_name = null;

  describe('POST /clothes/upload_image', () => {
    jest.setTimeout(60000);
    it('회원가입을 통한 유저 정보 생성', async () => {
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

    let token = null;

    it('로그인 후 토큰 정보 저장', async () => {
      const request_body = {email: 'test@test.com', password: '12341234'};

      const response =
          await request(app).post('/auth/login').send(request_body);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.message).toBe('로그인 성공.');

      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
      expect(decoded).toHaveProperty('user_id');
      token = response.body.token;
    });

    it('정상적인 옷 등록', async () => {
      const base64Image = ImageToBase64('test/clothes.jpg');
      const request_body = {
        userId: 1,
        base64Image: base64Image,
        clothingName: 'test-clothes',
        rating: '4',
        clothingType: ['상의'],
        clothingStyle: ['포멀'],
        imageMemo: 'no-memo',
        includePoint: {'x': 196.0, 'y': 264.0},
        excludePoint: {'x': 190.3333282470703, 'y': 197.66665649414062},
      };

      if (token != null) {
        const response = await request(app)
                             .post('/clothes/upload_image')
                             .set('Content-Type', 'application/json')
                             .set('Authorization', `Bearer ${token}`)
                             .send(request_body);
        expect(response.status).toBe(200);
        expect(response.body.message)
            .toBe('이미지 전처리 및 옷 등록 성공적으로 되었습니다.');
        expect(response.body).toHaveProperty('response');
        cloth_image_name = response.body.base_name;
      }
    });

    it('입력 필드 누락', async () => {
      const request_body = {
        userId: 1,
        clothingName: 'test-clothes',
        rating: '4',
        clothingType: ['상의'],
        clothingStyle: ['포멀'],
        imageMemo: 'no-memo',
        includePoint: {'x': 196.0, 'y': 264.0},
        excludePoint: {'x': 190.3333282470703, 'y': 197.66665649414062},
      };

      if (token != null) {
        const response = await request(app)
                             .post('/clothes/upload_image')
                             .set('Content-Type', 'application/json')
                             .set('Authorization', `Bearer ${token}`)
                             .send(request_body);
        expect(response.status).toBe(400);
        expect(response.body.message)
            .toBe('요청 body에 일부 필드가 누락되었습니다.');
      }
    });
  });

  describe('POST /clothes/virtual_fitting', () => {
    jest.setTimeout(60000);
    let token = null;
    it('로그인 후 토큰 정보 저장', async () => {
      const request_body = {email: 'test@test.com', password: '12341234'};

      const response =
          await request(app).post('/auth/login').send(request_body);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.message).toBe('로그인 성공.');

      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
      expect(decoded).toHaveProperty('user_id');
      token = response.body.token;
    });

    it('정상적인 가상 피팅 요청', async () => {
      const base64Image = ImageToBase64('test/clothes.jpg');
      const request_body = {
        cloth_image_name: cloth_image_name,
        person_base64_image: base64Image,
        userId: 1
      };

      if (token != null) {
        const response = await request(app)
                             .post('/clothes/virtual_fitting')
                             .set('Content-Type', 'application/json')
                             .set('Authorization', `Bearer ${token}`)
                             .send(request_body);

        expect(response.status).toBe(200);
        expect(response.body.message)
            .toBe('가상 피팅이 성공적으로 되었습니다.');
      }
    });
  });
});
