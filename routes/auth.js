const express = require("express");
const { join } = require("../controllers/auth");
const router = express.Router();

// POST /auth/join
router.post('/join', join);

module.exports = router;