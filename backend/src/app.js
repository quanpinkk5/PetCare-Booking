const express = require("express");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/customer/profileRoutes");

// pet
const petRoutes = require("./routes/customer/petRoutes");

// businessOwner
const businessesRoutes = require("./routes/businessOwner/businessesRoutes");

// Branches
const branchesRoutes = require("./routes/businessOwner/branchesRoutes");

// Services
const servicesRoutes = require("./routes/businessOwner/servicesRoutes");

// Branch Services
const branchServicesRoutes = require("./routes/businessOwner/branchServicesRoutes");

// Schedules
const schedulesRoutes = require("./routes/businessOwner/schedulesRoutes");

// Schedule Exceptions
const scheduleExceptionsRoutes = require("./routes/businessOwner/scheduleExceptionsRoutes");
const app = express();

// Cho phép frontend React gọi API và gửi cookie
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Đọc request body dạng JSON
app.use(express.json({ limit: "512kb" }));

// API kiểm tra backend
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PetCare Booking API is running",
  });
});

// Authentication API
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Customer Profile API
app.use("/api/customer", profileRoutes);

// Customer Pet API
app.use("/api/customer", petRoutes);
module.exports = app;

// BusinessOwner API
app.use("/api/businessOwner", businessesRoutes);

// Branches API
app.use("/api/businessOwner", branchesRoutes);

//Services API
app.use("/api/businessOwner", servicesRoutes);

// Branch Services API
app.use("/api/businessOwner", branchServicesRoutes);

// Schedules API
app.use("/api/businessOwner", schedulesRoutes);

// Schedule Exceptions API
app.use("/api/businessOwner", scheduleExceptionsRoutes);
