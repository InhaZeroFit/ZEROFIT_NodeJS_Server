const express = require("express");
const { upload_image, virtual_fitting } = require("../controllers/clothes");
const jwt_middleware = require("../middlewares/jwt_middleware");
const router = express.Router();

// POST /clothes/upload_image
router.post("/upload_image", jwt_middleware, upload_image);

// POST /clothes/virtual_fitting
router.post("/virtual_fitting", jwt_middleware, virtual_fitting);

// 임시로 GET /clothes/virtual_fitting
router.get("/virtual_fitting", virtual_fitting);

module.exports = router;