
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const socketAuth = async (socket, next) => {
  try {
    // Lấy access token khi thiết lập kết nối
    const token = socket.handshake.auth?.token;

    if (typeof token !== "string" || !token.trim()) {
      return next(new Error("Bạn chưa đăng nhập"));
    }

    // Kiểm tra chữ ký và thời hạn token
    const decoded = jwt.verify(token.trim(), process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    // Lấy thông tin tài khoản mới nhất
    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(new Error("Tài khoản không tồn tại"));
    }

    if (user.status !== "ACTIVE") {
      return next(new Error("Tài khoản đã bị khóa"));
    }

    // Kiểm tra phiên đăng nhập còn hiệu lực
    if (decoded.tokenVersion !== (user.tokenVersion ?? 0)) {
      return next(
        new Error(
          "Phiên đăng nhập đã hết hiệu lực. Vui lòng đăng nhập lại."
        )
      );
    }

    // Gắn thông tin người dùng vào kết nối Socket
    socket.user = user;

    next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return next(new Error("Token không hợp lệ hoặc đã hết hạn"));
    }

    console.error("Lỗi xác thực Socket.IO:", error);

    next(new Error("Lỗi xác thực người dùng"));
  }
};

module.exports = socketAuth;
