
const mongoose = require("mongoose");

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const scheduleExceptionSchema = new mongoose.Schema(
  {
    branchServiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BranchService",
      required: [true, "Dịch vụ chi nhánh không được để trống"],
      index: true,
    },

    // Ngày áp dụng ngoại lệ
    date: {
      type: Date,
      required: [true, "Ngày ngoại lệ không được để trống"],
    },

    type: {
      type: String,
      enum: ["CLOSED", "CUSTOM_HOURS", "BLOCK_SLOT"],
      required: [true, "Loại ngoại lệ không được để trống"],
    },

    // Dùng cho CUSTOM_HOURS và BLOCK_SLOT
    startTime: {
      type: String,
      default: "",
      trim: true,
    },

    endTime: {
      type: String,
      default: "",
      trim: true,
    },

    // Sức chứa mới khi điều chỉnh giờ phục vụ
    capacity: {
      type: Number,
      min: [1, "Sức chứa phải lớn hơn 0"],
      default: null,
    },

    reason: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Lý do không được quá 500 ký tự"],
    },
  },
  {
    timestamps: true,
    collection: "scheduleExceptions",
    versionKey: false,
  }
);

// Bắt buộc nhập giờ với CUSTOM_HOURS và BLOCK_SLOT
scheduleExceptionSchema.pre("validate", function () {
  if (this.type === "CLOSED") {
    this.startTime = "";
    this.endTime = "";
    this.capacity = null;
    return;
  }

  if (
    !TIME_REGEX.test(this.startTime) ||
    !TIME_REGEX.test(this.endTime)
  ) {
    this.invalidate(
      "startTime",
      "Giờ bắt đầu và giờ kết thúc phải đúng định dạng HH:mm"
    );
    return;
  }

  if (this.startTime >= this.endTime) {
    this.invalidate(
      "endTime",
      "Giờ kết thúc phải sau giờ bắt đầu"
    );
  }

  if (
    this.type === "CUSTOM_HOURS" &&
    (!Number.isInteger(this.capacity) || this.capacity < 1)
  ) {
    this.invalidate(
      "capacity",
      "Vui lòng nhập sức chứa hợp lệ"
    );
  }

  if (this.type === "BLOCK_SLOT") {
    this.capacity = null;
  }
});

// Tìm các ngoại lệ của dịch vụ theo ngày
scheduleExceptionSchema.index({
  branchServiceId: 1,
  date: 1,
});

module.exports = mongoose.model(
  "ScheduleException",
  scheduleExceptionSchema
);
