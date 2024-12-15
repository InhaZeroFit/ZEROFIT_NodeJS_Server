/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-16
 */

const redis = require('redis');
const dotenv = require('dotenv');
dotenv.config();

// Redis 클라이언트 설정
const redis_client = redis.createClient({
  url: `redis://${process.env.REDIS_HOST || '127.0.0.1'}:${
      process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});

redis_client.connect()
    .then(() => {
      console.log('[REDIS] Connected successfully!');
    })
    .catch((error) => {
      console.error('[REDIS] Connection error:', error);
    });

redis_client.on('error', (err) => {
  console.error('[REDIS] Client error:', err);
});

redis_client.on('end', () => {
  console.log('[REDIS] Connection closed.');
});

module.exports = redis_client;