const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Họ tên không được để trống"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email không được để trống"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    password: {
      type: String,
      required: [
        function () {
          return !this.googleId;
        },
        "Mật khẩu không được để trống",
      ],
      minlength: [8, "Mật khẩu phải có ít nhất 8 ký tự"],
      select: false,
    },

    avatar: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["CUSTOMER", "BUSINESS_OWNER", "ADMIN"],
      default: "CUSTOMER",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "LOCKED"],
      default: "ACTIVE",
    },

    address: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    gender: { type: String, enum: ["", "Nam", "Nữ", "Khác"], default: "" },
    birthday: { type: String, default: "" },
    bio: { type: String, trim: true, maxlength: 1000, default: "" },
    resetPasswordTokenHash: {
      type: String,
      default: null,
      select: false,
    },

    resetPasswordExpiresAt: {
      type: Date,
      default: null,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
      default: null,
    },
    // googleId: {
    //   type: String,
    //   unique: true,
    //   sparse: true,
    // },
  },
  {
    timestamps: true,
    collection: "users",
  },
);

// Mã hóa mật khẩu trước khi lưu
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  this.password = await bcrypt.hash(this.password, 12);
});

// Kiểm tra mật khẩu khi đăng nhập
userSchema.methods.comparePassword = function (candidatePassword) {
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
