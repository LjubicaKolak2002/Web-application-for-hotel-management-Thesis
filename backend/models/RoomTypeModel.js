const mongoose = require("mongoose");

const roomTypeModel = new mongoose.Schema({
  name: { type: String },
});

module.exports = mongoose.model("RoomType", roomTypeModel);
