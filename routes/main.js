const express = require("express");
const { home } = require("../controllers/main");
const router = express.Router();

router.get("/", home);

router.get("/data", (req, res) => {
    res.json({ message : "Hello from Node.js!"});
});

router.post("/data", (req, res) => {
    console.log(req.body);
    res.sendStatus(200);
});

module.exports = router;