require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const jwt = require("jsonwebtoken");
const User = require("./models/user.model");

const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 5000;

// HTTP server
const server = http.createServer(app);

// Socket setup
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

const io = new Server(server, {
  cors: {
    origin: clientUrl,
    credentials: true,
  },
});

const onlineUsers = new Map();

/* ================= SOCKET AUTH ================= */
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = user;
    next();

  } catch (err) {
    return next(new Error("Authentication failed"));
  }
});

/* ================= SOCKET EVENTS ================= */
io.on("connection", (socket) => {

  console.log("User connected:", socket.user.fullName);

  onlineUsers.set(socket.user._id.toString(), socket.id);

  io.emit("online_users", Array.from(onlineUsers.keys()));

  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("typing", (chatId) => {
    socket.to(chatId).emit("typing", {
      user: socket.user.fullName,
      chatId,
    });
  });

  socket.on("stop_typing", (chatId) => {
    socket.to(chatId).emit("stop_typing", {
      user: socket.user.fullName,
      chatId,
    });
  });

  socket.on("send_message", (data) => {
    const fullMessage = {
      chatId: data.chatId,
      message: data.message,
      sender: {
        _id: socket.user._id,
        fullName: socket.user.fullName,
      },
      status: "sent",
    };

    io.to(data.chatId).emit("receive_message", fullMessage);
  });

  socket.on("message_delivered", ({ messageId, chatId }) => {
    io.to(chatId).emit("message_status_update", {
      messageId,
      status: "delivered",
    });
  });

  socket.on("message_read", ({ messageId, chatId }) => {
    io.to(chatId).emit("message_status_update", {
      messageId,
      status: "read",
    });
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(socket.user._id.toString());

    io.emit("online_users", Array.from(onlineUsers.keys()));

    console.log("Disconnected:", socket.user.fullName);
  });
});

/* ================= START SERVER ================= */
const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("DB Connection Failed:", error);
    process.exit(1);
  }
};

startServer();