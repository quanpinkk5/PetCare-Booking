const mongoose = require("mongoose");

const serviceCategorySchema = new mongoose.Schema(
  {
    name: String,
    code: String,
    description: String,
    icon: String,
    status: { type: String, enum: ["ACTIVE", "INACTIVE"] },
  },
  { timestamps: true, collection: "serviceCategories", versionKey: false },
);

module.exports = mongoose.model("ServiceCategory", serviceCategorySchema);
