const express = require("express");
const { home } = require("../controllers/main");
const router = express.Router();

const FLASK_PORT = 5005;

router.get("/", home);

router.get("/my-image", async (req, res) => {
    try {
        const response = await fetch(`http://localhost:${FLASK_PORT}/user-image`);
        const data = await response.json(); // Parsing in JSON format
        res.json({
            message : data.message,
        });
    } catch (error) {
        console.error(`Flask 서버 요청 싪패: ${error}`);
        res.status(500).send("Flask 서버 요청 실패");
    };
});

module.exports = router;