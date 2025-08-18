const mongoose = require("mongoose");

const bookingModel = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  adults: { type: Number, required: true },
  babies: { type: Number, default: 0 },
  meals: [{ type: String, enum: ["breakfast", "lunch", "dinner"] }],
  status: {
    type: String,
    //enum: ["pending", "confirmed", "cancelled", "completed"],
    enum: ["reserved", "cancelled", "checked out", "checked in"],
    //default: "pending", //ovo je bilo na pocetku dok nisam imala placanje
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  totalPrice: { type: mongoose.Types.Decimal128 },
});

module.exports = mongoose.model("Booking", bookingModel);
