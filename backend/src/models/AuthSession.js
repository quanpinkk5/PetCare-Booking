
const mongoose = require("mongoose");

const authSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    refreshTokenHash: {
      type: String,
      required: true,
      select: false,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    deviceName: {
      type: String,
      default: "",
    },

    userAgent: {
      type: String,
      default: "",
    },

    ipAddress: {
      type: String,
      default: "",
    },

    lastUsedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "authSessions",
  }
);

// Tăng tốc truy vấn phiên đăng nhập theo user
authSessionSchema.index({ userId: 1 });

// Tăng tốc kiểm tra thời hạn phiên đăng nhập
authSessionSchema.index({ expiresAt: 1 });

module.exports = mongoose.model(
  "AuthSession",
  authSessionSchema
);
