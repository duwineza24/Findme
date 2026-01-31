const User = require("../models/usermodel");
const Item = require("../models/item");

exports.getStats = async (req, res) => {
  const users = await User.countDocuments();
  const items = await Item.countDocuments();
  const lost = await Item.countDocuments({ type: "lost" });
  const found = await Item.countDocuments({ type: "found" });

  res.json({ users, items, lost, found });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

exports.getAllItems = async (req, res) => {
  const items = await Item.find()
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
  res.json(items);
};

exports.deleteItem = async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: "Item deleted" });
};
