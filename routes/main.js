const express = require('express');
const {home} = require('../controllers/main');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

router.get('/', home);

module.exports = router;