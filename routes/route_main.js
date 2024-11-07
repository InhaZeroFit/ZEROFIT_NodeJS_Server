const express = require("express");
const { main } = require("../controllers/controller_main");
const router = express.Router();

router.get("/", main);

module.exports = router;