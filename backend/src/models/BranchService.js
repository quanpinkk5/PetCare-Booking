
const mongoose = require("mongoose");

const branchServiceSchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: [true, "Chi nhánh không được để trống"],
      index: true,
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Dịch vụ không được để trống"],
      index: true,
    },

    price: {
      type: Number,
      required: [true, "Giá dịch vụ không được để trống"],
      min: [0, "Giá dịch vụ không được âm"],
    },

    pricingUnit: {
      type: String,
      enum: ["PER_SERVICE", "PER_DAY"],
      required: [true, "Đơn vị tính giá không được để trống"],
    },

    durationMinutes: {
      type: Number,
      min: [0, "Thời lượng không được âm"],
      default: null,
    },

    capacity: {
      type: Number,
      min: [0, "Sức chứa không được âm"],
      default: null,
    },

    petTypes: {
      type: [
        {
          type: String,
          enum: ["DOG", "CAT"],
        },
      ],
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
    collection: "branchServices",
  }
);

// Tìm các dịch vụ được cung cấp tại một chi nhánh
branchServiceSchema.index({
  branchId: 1,
  status: 1,
});

// Tìm các chi nhánh đang cung cấp một dịch vụ
branchServiceSchema.index({
  serviceId: 1,
  status: 1,
});

// Không cho phép cùng một dịch vụ được gán trùng
// nhiều lần tại cùng một chi nhánh
branchServiceSchema.index(
  {
    branchId: 1,
    serviceId: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "BranchService",
  branchServiceSchema
);
