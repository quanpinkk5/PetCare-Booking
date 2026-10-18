const mongoose = require("mongoose");

const scheduleExceptionSchema = new mongoose.Schema(
  {
    branchServiceId: { type: mongoose.Schema.Types.ObjectId, ref: "BranchService" },
    date: Date,
    type: { type: String, enum: ["CLOSED", "CUSTOM_HOURS", "BLOCK_SLOT"] },
    startTime: String,
    endTime: String,
    capacity: Number,
    reason: String,
  },
  { timestamps: true, collection: "scheduleExceptions", versionKey: false },
);

module.exports = mongoose.model("ScheduleException", scheduleExceptionSchema);
