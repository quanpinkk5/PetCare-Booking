
const express = require("express");
const cors = require("cors");

const app = express();

// Cho phép Frontend gửi request đến Backend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

// Đọc dữ liệu JSON trong request body
app.use(express.json());

// API kiểm tra trạng thái Backend
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PetCare Booking Backend is running!",
  });
});

// Xử lý route không tồn tại
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API không tồn tại",
  });
});

module.exports = app;
