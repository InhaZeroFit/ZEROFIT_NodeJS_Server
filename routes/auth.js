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
const {join, login, logout} = require('../controllers/auth');
const router = express.Router();

// POST /auth/join
router.post('/join', join);

// POST /auth/login
router.post('/login', login);

// GET /auth/login
router.get('/logout', logout);

module.exports = router;