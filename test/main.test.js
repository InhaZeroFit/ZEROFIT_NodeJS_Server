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
const request = require('supertest');
const dotenv = require('dotenv');

// 2. Set environment variables
dotenv.config();

const app = `${process.env.TEST_SERVER_URL}`;

describe('Main Router Tests', () => {
  describe('GET /', () => {
    it('정상적인 GET /', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /health', () => {
    it('정상적인 GET /health', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('health check에 성공하였습니다.');
    });
  })
});