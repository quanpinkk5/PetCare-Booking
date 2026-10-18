const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    branchServiceId: { type: mongoose.Schema.Types.ObjectId, ref: "BranchService" },
    // The design does not define day codes or the nested slot structure.
    dayOfWeek: String,
    slots: { type: [mongoose.Schema.Types.Mixed], default: undefined },
    isActive: Boolean,
  },
  { timestamps: true, collection: "schedules", versionKey: false },
);

module.exports = mongoose.model("Schedule", scheduleSchema);
