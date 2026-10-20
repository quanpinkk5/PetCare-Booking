require("dotenv").config();
const registerConversationSocket = require("./src/sockets/conversationSocket");
const registerMessageSocket = require("./src/sockets/messageSocket");
const registerMessageReadSocket = require("./src/sockets/messageReadSocket");
const http = require("http");
const { Server } = require("socket.io");

const app = require("./src/app");
const connectDB = require("./src/config/database");
const socketAuth = require("./src/sockets/socketAuth");

const PORT = process.env.PORT || 5000;

// Tạo HTTP Server dùng chung với Express
const server = http.createServer(app);

// Khởi tạo Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

// Xác thực JWT trước khi kết nối
io.use(socketAuth);

io.on("connection", (socket) => {
  console.log(
    `Người dùng ${socket.user._id} đã kết nối: ${socket.id}`
  );

  // Tham gia và rời phòng chat
  registerConversationSocket(io, socket);

  // Gửi và nhận tin nhắn realtime
  registerMessageSocket(io, socket);

  // Đánh dấu tin nhắn đã đọc realtime
  registerMessageReadSocket(io, socket);

  socket.on("disconnect", (reason) => {
    console.log(
      `Người dùng ${socket.user._id} đã ngắt kết nối: ${reason}`
    );
  });
});

const startServer = async () => {
  try {
    // Kết nối MongoDB trước khi mở cổng
    await connectDB();

    // Khởi động Express và Socket.IO
    server.listen(PORT, () => {
      console.log(`Máy chủ đang chạy tại http://localhost:${PORT}`);
      console.log("Socket.IO đã bật xác thực JWT");
    });
  } catch (error) {
    console.error("Không thể khởi động máy chủ:", error.message);
    process.exit(1);
  }
};

startServer();
