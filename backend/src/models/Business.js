const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    slug: String,
    description: String,
    logo: String,
    // The design specifies Array without an item schema.
    images: { type: [mongoose.Schema.Types.Mixed], default: undefined },
    phone: String,
    email: String,
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"],
    },
    averageRating: Number,
    totalReviews: Number,
  },
  { timestamps: true, collection: "businesses", versionKey: false },
);

module.exports = mongoose.model("Business", businessSchema);
