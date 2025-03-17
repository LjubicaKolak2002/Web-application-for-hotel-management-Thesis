const mongoose = require("mongoose");

const eventModel = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  organizer: { type: String, required: true },
  datetime: { type: Date, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  availableSpots: { type: Number },
  image: { type: String },
});

eventModel.pre("save", function (next) {
  if (this.isNew) {
    this.availableSpots = this.capacity;
  }
  next();
});

module.exports = mongoose.model("Event", eventModel);
