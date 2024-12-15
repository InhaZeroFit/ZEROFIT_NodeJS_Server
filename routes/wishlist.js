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
const router = express.Router();
const jwt_middleware = require('../middlewares/jwt_middleware');
const {add_to_wishlist, get_wishlist} = require('../controllers/wishlist');

// GET /wishlist/info
router.get('/info', jwt_middleware, get_wishlist);

// POST /wishlist/add
router.post('/add', jwt_middleware, add_to_wishlist);

module.exports = router;