const express = require('express');
const {upload_image, virtual_fitting, images_info} =
    require('../controllers/clothes');
const jwt_middleware = require('../middlewares/jwt_middleware');
const router = express.Router();

// POST /clothes/upload_image
router.post('/upload_image', jwt_middleware, upload_image);

// POST /clothes/virtual_fitting
router.post('/virtual_fitting', jwt_middleware, virtual_fitting);

// GET /clothes/info
router.post('/info', jwt_middleware, images_info);

module.exports = router;