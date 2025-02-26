const mongoose = require("mongoose");

const roomCategoryModel = new mongoose.Schema ({
    name: {type: String},
    description: {type: String},
})

module.exports = mongoose.model("RoomCategory", roomCategoryModel);