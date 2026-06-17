const express = require("express");
const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const chatController = require("../controllers/chat.controller");

router.post("/access", protect, chatController.accessChat);

module.exports = router;