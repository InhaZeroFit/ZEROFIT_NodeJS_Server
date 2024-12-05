const express = require('express');
const router = express.Router();
const jwt_middleware = require('../middlewares/jwt_middleware');
const {add_to_wishlist, get_wishlist} = require('../controllers/wishlist');

// GET /wishlist/info
router.get('/info', jwt_middleware, get_wishlist);

// POST /wishlist/add
router.post('/add', jwt_middleware, add_to_wishlist);

module.exports = router;