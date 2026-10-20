const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: [true, "Cơ sở kinh doanh không được để trống"],
      index: true,
    },

    name: {
      type: String,
      required: [true, "Tên chi nhánh không được để trống"],
      trim: true,
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

    address: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    openingHours: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "branches",
  },
);

// Lấy danh sách chi nhánh thuộc một cơ sở
branchSchema.index({
  businessId: 1,
  createdAt: -1,
});

// Hỗ trợ lọc chi nhánh theo trạng thái
branchSchema.index({
  businessId: 1,
  status: 1,
});

module.exports = mongoose.model("Branch", branchSchema);
