require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/User");

const seedAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!process.env.MONGODB_URI) {
      throw new Error("Thiếu MONGODB_URI trong .env");
    }

    if (!email || !password || password.length < 12) {
      throw new Error(
        "Cần cấu hình ADMIN_EMAIL và ADMIN_PASSWORD tối thiểu 12 ký tự"
      );
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log(
        "Email này đã có tài khoản. Không tự động nâng quyền ADMIN."
      );
      return;
    }

    const admin = await User.create({
      fullName: "PetCare Administrator",
      email,
      password,
      role: "ADMIN",
      status: "ACTIVE",
    });

    console.log("Tạo tài khoản ADMIN thành công!");
    console.log("Admin ID:", admin._id.toString());
    console.log("Admin email:", admin.email);
  } catch (error) {
    console.error("Seed Admin thất bại:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();
