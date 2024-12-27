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
const express = require('express');

// 2. Import controllers
const {home} = require('../controllers/main');

// Define express router
const router = express.Router();

// GET /
router.get('/', home);

// GET /health
router.get('/health', (req, res, next) => {
  res.status(200).json({message: 'Health check is successful.'});
});

module.exports = router;