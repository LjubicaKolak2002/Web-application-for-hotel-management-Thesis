const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
  name: { type: String },
  surname: { type: String },
  username: { type: String },
  email: { type: String, unique: true, dropDups: true, required: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String },
  country: {
    name: { type: String },
    code: { type: String }, // ISO kod, HR
  },
});

module.exports = mongoose.model("User", userModel);
