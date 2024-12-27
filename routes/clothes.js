/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-27
 */

// 1. Import moduels
const express = require('express');

// 2. Import controllers
const {upload_image, virtual_fitting, images_info} =
    require('../controllers/clothes');
const jwt_middleware = require('../middlewares/jwt_middleware');

// Define express router
const router = express.Router();

// POST /clothes/upload_image
router.post('/upload_image', jwt_middleware, upload_image);

// POST /clothes/virtual_fitting
router.post('/virtual_fitting', jwt_middleware, virtual_fitting);

// GET /clothes/info
router.post('/info', jwt_middleware, images_info);

module.exports = router;