
const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    // Mỗi Business Owner chỉ được sở hữu 1 thương hiệu
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Chủ thương hiệu không được để trống"],
      unique: true,
    },

    // Tên thương hiệu
    name: {
      type: String,
      required: [true, "Tên thương hiệu không được để trống"],
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Slug không được để trống"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    logo: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "APPROVED",
        "REJECTED",
        "SUSPENDED",
      ],
      default: "PENDING",
      index: true,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: "businesses",
  }
);

// Phục vụ trang Admin quản lý thương hiệu
businessSchema.index({
  status: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "Business",
  businessSchema
);
