const express = require("express");
const router = express.Router();
const {
  getStats,
  getAllItems,
  getAllUsers,
  deleteItem,
  getAllClaims,
  updateClaimStatus,
  getAllChats,        // Add this
  getChatMessages,    // Add this
} = require("../controllers/adminContoller");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.get("/stats", auth, admin, getStats);
router.get("/items", auth, admin, getAllItems);
router.get("/users", auth, admin, getAllUsers);
router.delete("/items/:id", auth, admin, deleteItem);
router.get("/claims", auth, admin, getAllClaims);
router.patch("/claims/:itemId/:claimId", auth, admin, updateClaimStatus);
router.get("/chats", auth, admin, getAllChats);              // Add this
router.get("/chats/:chatId/messages", auth, admin, getChatMessages); // Add this

module.exports = router;