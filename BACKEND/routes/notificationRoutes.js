// routes/notificationRoutes.js
const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const Notification = require("../models/notification");

// GET all unread notifications for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
      isRead: false, // ✅ Correct field
    }).sort({ createdAt: -1 }); // latest first

    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// MARK notification as read
router.post("/:id/read", auth, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
});

// CREATE notification (used in ChatController or ItemController)
router.post("/create", auth, async (req, res) => {
  try {
    const { userId, message, link } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ message: "userId and message are required" });
    }

    const notification = await Notification.create({
      userId,
      message,
      link: link || "/dashboard",
      isRead: false,
    });

    res.status(201).json(notification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create notification" });
  }
});

module.exports = router;
