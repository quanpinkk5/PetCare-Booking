
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking không được để trống"],
      unique: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Khách hàng không được để trống"],
      index: true,
    },

    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: [true, "Cơ sở kinh doanh không được để trống"],
    },

    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: [true, "Chi nhánh không được để trống"],
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Dịch vụ không được để trống"],
    },

    rating: {
      type: Number,
      required: [true, "Số sao đánh giá không được để trống"],
      min: [1, "Đánh giá tối thiểu 1 sao"],
      max: [5, "Đánh giá tối đa 5 sao"],
      validate: {
        validator: Number.isInteger,
        message: "Số sao đánh giá phải là số nguyên",
      },
    },

    comment: {
      type: String,
      default: "",
      trim: true,
    },

    images: {
      type: [String],
      default: [],
    },

    businessReply: {
      content: {
        type: String,
        default: "",
        trim: true,
      },

      repliedAt: {
        type: Date,
        default: null,
      },

      repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    },

    status: {
      type: String,
      enum: ["VISIBLE", "HIDDEN"],
      default: "VISIBLE",
    },
  },
  {
    timestamps: true,
    collection: "reviews",
  },
);

// Lấy đánh giá theo Customer
reviewSchema.index({
  customerId: 1,
  createdAt: -1,
});

// Lấy đánh giá theo cơ sở kinh doanh
reviewSchema.index({
  businessId: 1,
  status: 1,
  createdAt: -1,
});

// Lấy đánh giá theo dịch vụ
reviewSchema.index({
  serviceId: 1,
  status: 1,
});

module.exports = mongoose.model("Review", reviewSchema);
