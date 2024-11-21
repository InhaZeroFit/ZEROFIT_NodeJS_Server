const express = require('express');
const { send_image_to_flask } = require('../controllers/user');

const router = express.Router();

// GET /user/preprocess
router.get('/preprocess', send_image_to_flask);

module.exports = router;