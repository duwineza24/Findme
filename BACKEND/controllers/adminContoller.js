const User = require("../models/usermodel");
const Item = require("../models/item");
const Chat = require("../models/Chat");
const Message = require("../models/Message");

/**
 * 📊 ADMIN STATS
 */
exports.getStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const items = await Item.countDocuments();
    const lost = await Item.countDocuments({ type: "lost" });
    const found = await Item.countDocuments({ type: "found" });

    res.json({ users, items, lost, found });
  } catch (err) {
    res.status(500).json({ message: "Failed to load stats" });
  }
};

/**
 * 📦 ALL ITEMS
 */
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to load items" });
  }
};

/**
 * 👥 ALL USERS
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to load users" });
  }
};

/**
 * ❌ DELETE ITEM
 */
exports.deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete item" });
  }
};

/**
 * 💬 GET ALL CLAIMS / MESSAGES
 */
exports.getAllClaims = async (req, res) => {
  try {
    const itemsWithClaims = await Item.find({ 
      "claims.0": { $exists: true } 
    })
      .populate("userId", "name email")
      .populate("claims.user", "name email")
      .sort({ updatedAt: -1 });

    const allClaims = [];
    itemsWithClaims.forEach(item => {
      item.claims.forEach(claim => {
        allClaims.push({
          _id: claim._id,
          item: {
            _id: item._id,
            title: item.title,
            type: item.type,
            description: item.description,
            location: item.location
          },
          owner: item.userId,
          claimer: claim.user,
          message: claim.message,
          claimType: claim.claimType,
          status: claim.status,
          createdAt: claim.createdAt
        });
      });
    });

    console.log("Fetched claims count:", allClaims.length);
    res.json(allClaims);
  } catch (err) {
    console.error("Error fetching claims:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ✅ UPDATE CLAIM STATUS (Approve/Reject)
 */
exports.updateClaimStatus = async (req, res) => {
  try {
    const { itemId, claimId } = req.params;
    const { status } = req.body;

    console.log("Updating claim:", { itemId, claimId, status });

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Use 'approved' or 'rejected'" });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const claim = item.claims.id(claimId);
    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    claim.status = status;
    
    if (status === "approved") {
      item.status = "resolved";
    }

    await item.save();
    await item.populate("claims.user", "name email");
    await item.populate("userId", "name email");

    console.log("Claim updated successfully");
    res.json({ message: `Claim ${status} successfully`, item });
  } catch (err) {
    console.error("Error updating claim:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * 💬 GET ALL CHATS (Admin)
 */
exports.getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find()
      .populate("itemId", "title type status")
      .populate("participants", "name email")
      .sort({ updatedAt: -1 });

    console.log("Fetched chats count:", chats.length);
    res.json(chats);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * 📩 GET MESSAGES FOR A SPECIFIC CHAT (Admin)
 */
exports.getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId)
      .populate("itemId", "title type")
      .populate("participants", "name email");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const messages = await Message.find({ chatId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json({ chat, messages });
  } catch (err) {
    console.error("Error fetching chat messages:", err);
    res.status(500).json({ message: "Server error" });
  }
};