// controllers/matchController.js
const Match = require("../models/matching");
const Item = require("../models/item");
const Notification = require("../models/notification");

// Create a match request
exports.createMatch = async (req, res) => {
  const { itemId, type } = req.body;
  const userId = req.user._id;

  try {
    // Prevent duplicate requests
    const existing = await Match.findOne({ itemId, userId, type });
    if (existing)
      return res.status(400).json({ message: "You already claimed this item" });

    const match = await Match.create({ itemId, userId, type });
    // 🔔 NOTIFY ITEM OWNER
    await Notification.create({
      userId: item.userId, // owner of item
      message: "Someone responded to your item",
      link: "/dashboard",
    });
    res.json(match);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all matches related to your items
exports.getMyItemMatches = async (req, res) => {
  const userId = req.user._id;

  try {
    // 1. Get items posted by the user
    const items = await Item.find({ userId }).select("_id title");
    const itemIds = items.map((i) => i._id);

    // 2. Get all match requests for those items
    const matches = await Match.find({ itemId: { $in: itemIds } })
      .populate("userId", "name email")
      .populate("itemId", "title type");

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Accept a match
exports.acceptMatch = async (req, res) => {
  const matchId = req.params.id;

  try {
    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: "Match not found" });

    match.status = "accepted";
    await match.save();

    res.json({ message: "Match accepted", match });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
