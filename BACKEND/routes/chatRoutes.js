const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const chatController = require("../controllers/chatController");

router.post("/", auth, chatController.getOrCreateChat);
router.get("/", auth, chatController.getMyChats);
router.get("/unread", auth, chatController.getUnreadChatCount);
router.get("/:chatId/messages", auth, chatController.getMessages);
router.post("/:chatId/messages", auth, chatController.sendMessage);

module.exports = router;
