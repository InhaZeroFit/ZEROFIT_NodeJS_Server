const express = require('express');
const jwt_middleware = require('../middlewares/jwt_middleware');
const {register_clothes, market_info} = require('../controllers/market');
const router = express.Router();

// POST /market/sale
router.post('/sale', jwt_middleware, register_clothes);

// POST /market/info
router.post('/info', jwt_middleware, market_info);
module.exports = router;