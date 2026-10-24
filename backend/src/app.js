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

//Customer
const customerBusinessesRoutes = require("./routes/customer/businessesRoutes");
const customerBranchesRoutes = require("./routes/customer/branchesRoutes");
const customerBranchServicesRoutes = require("./routes/customer/branchServicesRoutes");
const customerServicesRoutes = require("./routes/customer/servicesRoutes");
const customerAvailableSlotsRoutes = require("./routes/customer/availableSlotsRoutes");
// Booking
const customerBookingRoutes = require("./routes/customer/bookingRoutes");
// Review
const customerReviewRoutes = require("./routes/customer/reviewRoutes");
const publicReviewRoutes = require("./routes/public/reviewRoutes");
const app = express();

// Message
const customerMessageRoutes = require("./routes/customer/messageRoutes");

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

// Phân dành cho customer- Public API
// Businesses API
app.use("/api/customer", customerBusinessesRoutes);
// Branches API
app.use("/api/customer", customerBranchesRoutes);
// branch services API
app.use("/api/customer", customerBranchServicesRoutes);
app.use("/api/customer", customerServicesRoutes);
app.use("/api/customer", customerAvailableSlotsRoutes);
// API - Booking
app.use("/api/customer", customerBookingRoutes);
// API - Review
app.use("/api/customer", customerReviewRoutes);
app.use("/api", publicReviewRoutes);

// API - Message
app.use("/api/customer", customerMessageRoutes);
// API - BusinessesOwner

