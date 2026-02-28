const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());

// Handle preflight requests
app.options('/{*path}', cors());

// Connect to DB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



const userRoute=require("./routes/userRoute")
const itemRoute=require("./routes/itemRoute")
const matchRoutes = require("./routes/matchRoute");
const chatRoutes = require("./routes/chatRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");

// routes
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/item", require("./routes/itemRoute"));
app.use("/api/match", require("./routes/matchRoute"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/notification", require("./routes/notificationRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Default route
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) console.error(err);
  else console.log(`Server running on port ${PORT}`);
});




