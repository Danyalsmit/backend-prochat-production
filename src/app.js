const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");

const app = express();

const chatRoutes = require("./routes/chat.routes");
const messageRoutes = require("./routes/message.routes");

app.use(helmet());

app.use(express.json());

app.use(cookieParser());

app.use(cors({ origin: process.env.CLIENT_URL, credentials:true }));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


module.exports = app;