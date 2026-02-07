const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {
  createItem,
  getAllItems,
  getMyItems,
  getSingleItem,
  updateItem,
  deleteItem,
  claimItem,
  resolveItem,
  
} = require("../controllers/itemController");

/**
 * ✅ CREATE ITEM (WITH IMAGE)
 */
router.post("/", auth, upload.single("image"), createItem);

/**
 * PUBLIC
 */
router.get("/", getAllItems);

/**
 * PRIVATE
 */
router.get("/my-items", auth, getMyItems);

/**
 * ✅ SINGLE ITEM (FOR EDIT)
 */
router.get("/:id", auth, getSingleItem);

/**
 * ✅ UPDATE ITEM (WITH IMAGE)
 */
router.put("/:id", auth, upload.single("image"), updateItem);

/**
 * DELETE
 */
router.delete("/:id", auth, deleteItem);

router.post("/:id/claim", auth, claimItem); // <-- This is why claiming wasn't working

/**
 * ✅ RESOLVE ITEM
 */
router.post("/:id/resolve", auth, resolveItem);
module.exports = router;
