const mongoose = require("mongoose");

const roomFeaturesModel = new mongoose.Schema ({
    name: {type: String},
})

module.exports = mongoose.model("RoomFeature", roomFeaturesModel);