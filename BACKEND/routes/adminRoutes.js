const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const {
  getStats,
  getAllUsers,
  getAllItems,
  deleteItem,
} = require("../controllers/adminContoller");

router.get("/stats", auth, admin, getStats);
router.get("/users", auth, admin, getAllUsers);
router.get("/items", auth, admin, getAllItems);
router.delete("/items/:id", auth, admin, deleteItem);

module.exports = router;
