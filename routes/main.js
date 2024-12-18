/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-16
 */

const express = require('express');
const {home} = require('../controllers/main');
const router = express.Router();
const dotenv = require('dotenv');
const {json} = require('sequelize');
dotenv.config();

router.get('/', home);

// GET /health
router.get('/health', (req, res, next) => {
  res.status(200).json({status: 'OK'});
});

router.get('/test', (req, res, next) => {
  res.status(200), json({message: 'success!'});
});

module.exports = router;