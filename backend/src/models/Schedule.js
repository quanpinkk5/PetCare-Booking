
const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    startTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/,
    },

    endTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["AVAILABLE", "MAINTENANCE", "OFF"],
      default: "AVAILABLE",
    },
  },
  { _id: true }
);

const scheduleSchema = new mongoose.Schema(
  {
    branchServiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BranchService",
      required: true,
      index: true,
    },

    dayOfWeek: {
      type: String,
      enum: [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ],
      required: true,
    },

    slots: {
      type: [slotSchema],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "schedules",
    versionKey: false,
  }
);

// Một dịch vụ chỉ có một lịch cho mỗi thứ trong tuần
scheduleSchema.index(
  { branchServiceId: 1, dayOfWeek: 1 },
  { unique: true }
);

// Giờ kết thúc phải sau giờ bắt đầu
slotSchema.path("endTime").validate(function (value) {
  return Boolean(this.startTime) && value > this.startTime;
}, "Giờ kết thúc phải sau giờ bắt đầu");

// Không cho phép các khung giờ bị chồng nhau
scheduleSchema.path("slots").validate(function (slots) {
  const sorted = [...slots].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].startTime < sorted[i - 1].endTime) {
      return false;
    }
  }

  return true;
}, "Các khung giờ không được chồng nhau");

module.exports = mongoose.model("Schedule", scheduleSchema);
