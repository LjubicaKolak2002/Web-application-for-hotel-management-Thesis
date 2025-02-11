const mongoose = require("mongoose");

const userModel = new mongoose.Schema ({
    name: {type: String},
    surname: {type: String},
    username: {type: String},
    email: {type: String, unique: true, dropDups: true, required:true},
    password: {type: String, required: true},
    phone: {type: String},
    role: {type: String}
})

module.exports = mongoose.model("User", userModel);