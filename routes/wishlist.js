/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-27
 */

// 1. Import modules
const express = require('express');

// 2. Import controllers
const {add, info} = require('../controllers/wishlist');
const jwt_middleware = require('../middlewares/jwt_middleware');

// Define express router
const router = express.Router();

// GET /wishlist/info
router.post('/info', jwt_middleware, info);

// POST /wishlist/add
router.post('/add', jwt_middleware, add);

module.exports = router;