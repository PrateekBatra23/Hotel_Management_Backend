const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["single", "double", "suite"],
    },
    price: {
      type: Number,
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    description: String,
    amenities: [String], // optional array of features
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
