
const User = require("../../models/User");

// POST /api/admin/business-owners
const createBusinessOwner = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body || {};

    // Kiểm tra dữ liệu đầu vào
    if (typeof fullName !== "string" || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập họ tên chủ cơ sở",
      });
    }

    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Email không hợp lệ",
      });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu phải có ít nhất 8 ký tự",
      });
    }

    if (
      phone !== undefined &&
      (typeof phone !== "string" || phone.trim().length > 20)
    ) {
      return res.status(400).json({
        success: false,
        message: "Số điện thoại không hợp lệ",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Không tạo tài khoản trùng email
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email này đã được đăng ký",
      });
    }

    // Admin chỉ tạo tài khoản, KHÔNG tạo cơ sở kinh doanh
    const owner = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone?.trim() || "",
      password,
      role: "BUSINESS_OWNER",
      status: "ACTIVE",
    });

    // Không trả mật khẩu/hash cho frontend
    return res.status(201).json({
      success: true,
      message: "Tạo tài khoản chủ cơ sở thành công",
      data: {
        user: {
          _id: owner._id,
          fullName: owner.fullName,
          email: owner.email,
          phone: owner.phone,
          role: owner.role,
          status: owner.status,
          createdAt: owner.createdAt,
        },
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email này đã được đăng ký",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((item) => item.message)
          .join(", "),
      });
    }

    console.error("Create business owner error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể tạo tài khoản chủ cơ sở",
    });
  }
};

module.exports = {
  createBusinessOwner,
};
