const mongoose = require("mongoose");

const taskModel = new mongoose.Schema({
  maid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  note: {
    type: String,
    default: "",
  },
  cleaning: {
    type: Boolean,
    default: true, // defaultno je zadatak za čišćenje
  },
});

module.exports = mongoose.model("Task", taskModel);
