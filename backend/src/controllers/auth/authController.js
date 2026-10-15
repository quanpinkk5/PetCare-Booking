const crypto = require("node:crypto");
const AuthSession = require("../../models/AuthSession");
const { sendResetPasswordEmail } = require("../../services/emailService");
const User = require("../../models/User");
const authService = require("../../services/authService");

const isProduction = process.env.NODE_ENV === "production";

const REFRESH_COOKIE = "petcare_refresh_token";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Chỉ trả các thông tin được phép hiển thị
const formatUser = (user) => ({
  id: user._id.toString(),
  fullName: user.fullName,
  name: user.fullName,
  email: user.email,
  phone: user.phone,
  avatar: user.avatar,
  role: user.role,
  status: user.status,
  address: user.address,
});

// Lấy refresh token từ cookie
const getRefreshToken = (req) => {
  const cookieHeader = req.headers.cookie || "";

  const item = cookieHeader
    .split(";")
    .find((cookie) => cookie.trim().startsWith(`${REFRESH_COOKIE}=`));

  if (!item) return null;

  return item.trim().slice(REFRESH_COOKIE.length + 1);
};

// Lưu refresh token trong HttpOnly cookie
const setRefreshCookie = (res, refreshToken) => {
  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);
};

// Xóa refresh token cookie
const clearRefreshCookie = (res) => {
  res.clearCookie(REFRESH_COOKIE, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/api/auth",
  });
};

// Lấy thông tin thiết bị để tạo phiên
const getDeviceInfo = (req) => ({
  userAgent: req.get("user-agent") || "",
  ipAddress: req.ip || "",
  deviceName: "",
});

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body || {};

    if (
      typeof fullName !== "string" ||
      !fullName.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Thông tin đăng ký không hợp lệ. Mật khẩu cần ít nhất 8 ký tự.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email đã được sử dụng",
      });
    }

    // Không nhận role/status từ frontend
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: typeof phone === "string" ? phone.trim() : "",
      password,
      role: "CUSTOMER",
      status: "ACTIVE",
    });

    const tokens = await authService.createAuthSession(
      user,
      getDeviceInfo(req),
    );

    setRefreshCookie(res, tokens.refreshToken);

    return res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      data: {
        user: formatUser(user),
        accessToken: tokens.accessToken,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email đã được sử dụng",
      });
    }

    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ khi đăng ký",
    });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập email và mật khẩu",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng",
      });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message: "Tài khoản đã bị khóa",
      });
    }

    const tokens = await authService.createAuthSession(
      user,
      getDeviceInfo(req),
    );

    setRefreshCookie(res, tokens.refreshToken);

    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      data: {
        user: formatUser(user),
        accessToken: tokens.accessToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ khi đăng nhập",
    });
  }
};

// GET /api/auth/me
// Yêu cầu authMiddleware gắn user vào req.user
const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      user: formatUser(req.user),
    },
  });
};

// POST /api/auth/refresh
const refresh = async (req, res) => {
  try {
    const refreshToken = getRefreshToken(req);

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy phiên đăng nhập",
      });
    }

    const tokens = await authService.refreshAuthSession(refreshToken);

    setRefreshCookie(res, tokens.refreshToken);

    return res.status(200).json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
      },
    });
  } catch (error) {
    clearRefreshCookie(res);

    return res.status(401).json({
      success: false,
      message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn",
    });
  }
};

// POST /api/auth/logout
const logout = async (req, res) => {
  try {
    const refreshToken = getRefreshToken(req);

    if (refreshToken) {
      await authService.revokeAuthSession(refreshToken);
    }

    clearRefreshCookie(res);

    return res.status(200).json({
      success: true,
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể đăng xuất lúc này",
    });
  }
};

const RESET_TOKEN_MINUTES = 15;

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  const successMessage =
    "Nếu email đã được đăng ký, chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu.";

  try {
    const { email } = req.body || {};

    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Email không hợp lệ",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    // Không tiết lộ email có tồn tại trong hệ thống hay không
    if (!user) {
      return res.status(200).json({
        success: true,
        message: successMessage,
      });
    }

    // Tạo token ngẫu nhiên và chỉ lưu hash vào MongoDB
    const resetToken = crypto.randomBytes(32).toString("hex");

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordTokenHash = resetTokenHash;
    user.resetPasswordExpiresAt = new Date(
      Date.now() + RESET_TOKEN_MINUTES * 60 * 1000,
    );

    await user.save();

    // FRONTEND_URL lấy từ backend/.env
    const frontendUrl = process.env.FRONTEND_URL;

    if (!frontendUrl) {
      throw new Error("FRONTEND_URL chưa được cấu hình");
    }

    const resetUrl =
      `${frontendUrl.replace(/\/$/, "")}/reset-password` +
      `?token=${encodeURIComponent(resetToken)}`;

    await sendResetPasswordEmail(user.email, resetUrl);

    return res.status(200).json({
      success: true,
      message: successMessage,
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể xử lý yêu cầu lúc này",
    });
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body || {};

    if (
      typeof token !== "string" ||
      !/^[a-f0-9]{64}$/.test(token) ||
      typeof newPassword !== "string" ||
      newPassword.length < 8
    ) {
      return res.status(400).json({
        success: false,
        message: "Token hoặc mật khẩu mới không hợp lệ",
      });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Tìm tài khoản có token hợp lệ và chưa hết hạn
    const user = await User.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpiresAt: { $gt: new Date() },
    }).select("+resetPasswordTokenHash");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Liên kết khôi phục không hợp lệ hoặc đã hết hạn",
      });
    }

    // Hash password sẽ được User.js xử lý ở pre("save")
    user.password = newPassword;
    user.resetPasswordTokenHash = null;
    user.resetPasswordExpiresAt = null;
    // Vô hiệu hóa tất cả Access Token cũ
    user.tokenVersion = (user.tokenVersion ?? 0) + 1;

    await user.save();

    // Thu hồi toàn bộ refresh session cũ của tài khoản
    await AuthSession.updateMany(
      {
        userId: user._id,
        revokedAt: null,
      },
      {
        $set: {
          revokedAt: new Date(),
        },
      },
    );

    return res.status(200).json({
      success: true,
      message: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể đặt lại mật khẩu lúc này",
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
};
