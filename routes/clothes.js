const express = require("express");
const { upload_image } = require("../controllers/clothes");
const router = express.Router();

// POST /clothes/upload_image
router.post("/upload_image", upload_image);

module.exports = router;