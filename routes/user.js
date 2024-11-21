const express = require('express');
const userController = require('../controllers/user');

const router = express.Router();

// POST /user/preprocess
router.get('/preprocess', userController.sendImageToFlask);

module.exports = router;