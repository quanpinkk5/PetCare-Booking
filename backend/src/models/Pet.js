const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    species: { type: String, enum: ["DOG", "CAT"] },
    breed: String,
    gender: { type: String, enum: ["MALE", "FEMALE"] },
    dateOfBirth: Date,
    weight: Number,
    avatar: String,
    personality: String,
    feedingNotes: String,
    careNotes: String,
    status: { type: String, enum: ["ACTIVE", "INACTIVE"] },
  },
  { timestamps: true, collection: "pets", versionKey: false },
);

module.exports = mongoose.model("Pet", petSchema);
