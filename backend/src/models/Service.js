
const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: [true, "Cơ sở kinh doanh không được để trống"],
      index: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCategory",
      required: [true, "Danh mục dịch vụ không được để trống"],
    },

    name: {
      type: String,
      required: [true, "Tên dịch vụ không được để trống"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    serviceType: {
      type: String,
      enum: ["APPOINTMENT", "BOARDING"],
      required: [true, "Loại dịch vụ không được để trống"],
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
    collection: "services",
  }
);

// Lấy dịch vụ thuộc một cơ sở
serviceSchema.index({
  businessId: 1,
  createdAt: -1,
});

// Lọc dịch vụ theo danh mục
serviceSchema.index({
  categoryId: 1,
  status: 1,
});

// Lọc dịch vụ theo loại
serviceSchema.index({
  businessId: 1,
  serviceType: 1,
  status: 1,
});

module.exports = mongoose.model("Service", serviceSchema);
