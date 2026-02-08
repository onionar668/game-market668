const express = require("express");
const {
  getConversations,
  getMessages,
  sendMessage,
} = require("../controllers/messageController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/conversations", getConversations);
router.get("/conversations/:partnerId", getMessages);
router.post("/", sendMessage);

module.exports = router;
