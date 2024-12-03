const express = require('express');
const jwt_middleware = require('../middlewares/jwt_middleware');
const {register_clothes} = require('../controllers/market');
const router = express.Router();

// POST /market/sale
router.post('/sale', jwt_middleware, register_clothes);

module.exports = router;