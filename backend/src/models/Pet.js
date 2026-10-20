
const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    species: {
      type: String,
      enum: ["DOG", "CAT"],
      required: true,
    },

    breed: {
      type: String,
      default: "",
      trim: true,
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE"],
      default: null,
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    weight: {
      type: Number,
      min: 0,
      default: null,
    },

    avatar: {
      type: String,
      default: "",
    },

    personality: {
      type: String,
      default: "",
    },

    feedingNotes: {
      type: String,
      default: "",
    },

    careNotes: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
    collection: "pets",
  },
);

module.exports = mongoose.model("Pet", petSchema);
