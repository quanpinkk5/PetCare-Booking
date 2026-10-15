
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();

// Cho phép frontend React gọi API và gửi cookie
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Đọc request body dạng JSON
app.use(express.json());

// API kiểm tra backend
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PetCare Booking API is running",
  });
});

// Authentication API
app.use("/api/auth", authRoutes);

module.exports = app;

