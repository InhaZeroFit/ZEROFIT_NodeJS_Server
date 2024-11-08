const express = require("express");
const { home } = require("../controllers/controller_main");
const main_router = express.Router();

main_router.get("/", home);

module.exports = main_router;