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
const {register_clothes, market_info, purchase_clothes} =
    require('../controllers/market');
const jwt_middleware = require('../middlewares/jwt_middleware');

// Define express router
const router = express.Router();

// POST /market/sale
router.post('/sale', jwt_middleware, register_clothes);

// POST /market/info
router.post('/info', jwt_middleware, market_info);

// POST /market/purchase
router.post('/purchase', jwt_middleware, purchase_clothes);

module.exports = router;