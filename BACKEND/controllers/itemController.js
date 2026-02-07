const Item = require("../models/item");

/**
 * CREATE ITEM
 */
exports.createItem = async (req, res) => {
  try {
    const { title, description, location, contactInfo, type } = req.body;

    if (!title || !description || !location || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const item = await Item.create({
      title,
      description,
      location,
      contactInfo,
      type,
      userId: req.user._id,
      image: req.file ? req.file.filename : null,
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET SINGLE ITEM (FOR EDIT PAGE)
 */
exports.getSingleItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("userId", "name email")
      .populate("claims.user", "name email");

    if (!item) return res.status(404).json({ message: "Item not found" });

    // Only owner can edit
    if (item.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET ALL ITEMS (PUBLIC)
 */
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email")
      .populate("claims.user", "name email");

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET MY ITEMS
 */
exports.getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user._id })
      .populate("claims.user", "name email");

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * CLAIM ITEM
 */
exports.claimItem = async (req, res) => {
  try {
    const { claimType } = req.body; // "lost" or "found"
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.userId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot claim your own item" });
    }

    const alreadyClaimed = item.claims.some(
      (c) => c.user.toString() === req.user._id.toString()
    );

    if (alreadyClaimed) {
      return res.status(400).json({ message: "You already claimed this item" });
    }

    item.claims.push({
      user: req.user._id,
      claimType,
    });

    // Optional: mark status as matched
    item.status = "matched";

    await item.save();
    const populatedItem = await item.populate("claims.user", "name email");
    res.json(populatedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * RESOLVE ITEM (OWNER CONFIRMS RECOVERY)
 */
exports.resolveItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    item.status = "resolved";
    await item.save();

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE ITEM
 */
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    item.title = req.body.title;
    item.description = req.body.description;
    item.location = req.body.location;
    item.contactInfo = req.body.contactInfo;
    item.type = req.body.type;

    if (req.file) {
      item.image = req.file.filename;
    }

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE ITEM
 */
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await item.deleteOne();
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
