const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matchingControllers");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, matchController.createMatch); // claim item
router.get("/my-requests", authMiddleware, matchController.getMyItemMatches); // see requests
router.post("/:id/accept", authMiddleware, matchController.acceptMatch); // accept

module.exports = router;
