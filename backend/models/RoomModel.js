const mongoose = require("mongoose");

const roomModel = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoomCategory",
    required: true,
  },
  features: [{ type: mongoose.Schema.Types.ObjectId, ref: "RoomFeature" }],
  price: { type: mongoose.Types.Decimal128 },
});

module.exports = mongoose.model("Room", roomModel);
