const express = require("express");
const { upload_image } = require("../controllers/clothes");
const jwt_middleware = require("../middlewares/jwt_middleware");
const router = express.Router();

// POST /clothes/upload_image
router.post("/upload_image", jwt_middleware, upload_image);

module.exports = router;