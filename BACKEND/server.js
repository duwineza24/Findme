const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
