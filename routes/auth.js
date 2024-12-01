const express = require('express');
const {join, login} = require('../controllers/auth');
const router = express.Router();

// POST /auth/join
router.post('/join', join);

// POST /auth/login
router.post('/login', login);

module.exports = router;