const Chat = require("../models/Chat");
const Message = require("../models/Message");
const Notification = require("../models/notification");

/**
 * 1️⃣ Create or Get Chat
 */
exports.getOrCreateChat = async (req, res) => {
  try {
    const { itemId, otherUserId } = req.body;
    const userId = req.user._id.toString();

    let chat = await Chat.findOne({
      itemId,
      participants: { $all: [userId, otherUserId] },
    });

    if (!chat) {
      chat = await Chat.create({
        itemId,
        participants: [userId, otherUserId],
        unreadCounts: {
          [userId]: 0,
          [otherUserId]: 0,
        },
        lastMessage: "",
      });
    }

    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Chat creation failed" });
  }
};

/**
 * 2️⃣ Get Messages + Reset unread for current user
 */
exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id.toString();

    const messages = await Message.find({ chatId })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    // Reset unread messages for this user
    await Chat.findByIdAndUpdate(chatId, {
      $set: { [`unreadCounts.${userId}`]: 0 },
    });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load messages" });
  }
};

/**
 * 3️⃣ Send Message + Update unread + Notification
 */
exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const senderId = req.user._id.toString();
    const { text } = req.body;

    const message = await Message.create({
      chatId,
      sender: senderId,
      text,
    });

    const chat = await Chat.findById(chatId);

    // Find receiver
    const receiverId = chat.participants.find((id) => id.toString() !== senderId);

    // Increment unread for receiver
    chat.unreadCounts[receiverId] =
      (chat.unreadCounts[receiverId] || 0) + 1;

    chat.lastMessage = text;
    await chat.save();

    // Create notification
    await Notification.create({
      userId: receiverId,
      message: "You have a new chat message",
      link: `/chat/${chatId}`,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Message sending failed" });
  }
};

/**
 * 4️⃣ Get all chats for logged-in user
 */
exports.getMyChats = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const chats = await Chat.find({ participants: userId })
      .populate("itemId", "title status")
      .populate("participants", "name")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load chats" });
  }
};

/**
 * 5️⃣ Get total unread chat count
 */
exports.getUnreadChatCount = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const chats = await Chat.find({ participants: userId });
    let totalUnread = 0;

    chats.forEach((chat) => {
      totalUnread += chat.unreadCounts[userId] || 0;
    });

    res.json({ totalUnread });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get unread count" });
  }
};
