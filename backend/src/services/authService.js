const crypto = require("node:crypto");
const jwt = require("jsonwebtoken");
const AuthSession = require("../models/AuthSession");
const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_DAYS = 7;
// tạo JWT access token
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
      tokenVersion: user.tokenVersion ?? 0,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      algorithm: "HS256",
    },
  );
};
// Tạo refresh token ngẫu nhiên
const generateRefreshToken = () => {
  return crypto.randomBytes(48).toString("hex");
};
// Hash refresh token trước khi lưu MongoDB
const hashRefreshToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
// Tạo phiên đăng nhập
const createAuthSession = async (user, deviceInfo = {}) => {
  const refreshToken = generateRefreshToken();

  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
  );

  const session = await AuthSession.create({
    userId: user._id,
    refreshTokenHash: hashRefreshToken(refreshToken),
    expiresAt,
    deviceName: deviceInfo.deviceName || "",
    userAgent: deviceInfo.userAgent || "",
    ipAddress: deviceInfo.ipAddress || "",
    lastUsedAt: new Date(),
  });

  return {
    accessToken: generateAccessToken(user),
    refreshToken,
    sessionId: session._id,
  };
};
// Làm mới phiên đăng nhập
const refreshAuthSession = async (refreshToken) => {
  if (typeof refreshToken !== "string" || !refreshToken) {
    throw new Error("Refresh token không hợp lệ");
  }

  const tokenHash = hashRefreshToken(refreshToken);

  // Tìm phiên bằng hash, không tìm bằng token gốc
  const session = await AuthSession.findOne({
    refreshTokenHash: tokenHash,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  })
    .select("+refreshTokenHash")
    .populate("userId");

  if (!session || !session.userId) {
    throw new Error("Phiên đăng nhập không hợp lệ hoặc đã hết hạn");
  }

  const user = session.userId;

  if (user.status !== "ACTIVE") {
    throw new Error("Tài khoản không còn hoạt động");
  }

  // Xoay vòng refresh token
  const newRefreshToken = generateRefreshToken();
  const newTokenHash = hashRefreshToken(newRefreshToken);

  // Cập nhật có điều kiện để token cũ chỉ được sử dụng một lần
  const updatedSession = await AuthSession.findOneAndUpdate(
    {
      _id: session._id,
      refreshTokenHash: tokenHash,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    },
    {
      $set: {
        refreshTokenHash: newTokenHash,
        lastUsedAt: new Date(),
      },
    },
    { new: true },
  );

  if (!updatedSession) {
    throw new Error("Refresh token đã được sử dụng hoặc thu hồi");
  }

  return {
    accessToken: generateAccessToken(user),
    refreshToken: newRefreshToken,
  };
};

// Đăng xuất: thu hồi phiên đăng nhập
const revokeAuthSession = async (refreshToken) => {
  if (typeof refreshToken !== "string" || !refreshToken) {
    return;
  }

  await AuthSession.findOneAndUpdate(
    {
      refreshTokenHash: hashRefreshToken(refreshToken),
      revokedAt: null,
    },
    {
      $set: {
        revokedAt: new Date(),
      },
    },
  );
};

module.exports = {
  generateAccessToken,
  createAuthSession,
  refreshAuthSession,
  revokeAuthSession,
};
