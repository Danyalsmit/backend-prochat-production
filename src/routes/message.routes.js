const express = require("express");
const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const messageController = require("../controllers/message.controller");

// send message
router.post("/send", protect, messageController.sendMessage);

// get messages
router.get("/:chatId", protect, messageController.getMessages);

module.exports = router;