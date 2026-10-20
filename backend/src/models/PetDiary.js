const mongoose = require("mongoose");

const petDiarySchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    petId: { type: mongoose.Schema.Types.ObjectId, ref: "Pet" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // EATING and WALKING are examples, not an exhaustive list.
    activityType: String,
    description: String,
    images: { type: [mongoose.Schema.Types.Mixed], default: undefined },
    activityTime: Date,
  },
  { timestamps: true, collection: "petDiaries", versionKey: false },
);

module.exports = mongoose.model("PetDiary", petDiarySchema);
