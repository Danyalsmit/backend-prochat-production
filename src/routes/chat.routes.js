const express = require("express");
const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const chatController = require("../controllers/chat.controller");

router.get("/", protect, chatController.getMyChats);
router.get("/my-chats", protect, chatController.getMyChats);
router.post("/access", protect, chatController.accessChat);

module.exports = router;