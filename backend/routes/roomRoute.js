const express = require("express");
const RoomCategory = require("../models/RoomCategoryModel.js");
const RoomFeature = require("../models/RoomFeaturesModel.js");
const { signJwt, verifyJwt } = require("../jwt.js");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const RoomModel = require("../models/RoomModel.js");
const RoomCategoryModel = require("../models/RoomCategoryModel.js");
const RoomFeaturesModel = require("../models/RoomFeaturesModel.js");

const roomRouter = express.Router();
//new room category
roomRouter.route("/add-roomCategory").post(verifyJwt, (req, res) => {
  try {
    const category = new RoomCategory(req.body);
    category.save();
    return res.status(210).json(category);
  } catch (error) {
    return res.json({ error: "can't add" });
  }
});

//categories list
roomRouter.route("/categories-list").get(verifyJwt, (req, res) => {
  RoomCategory.find()
    .sort({ name: 1 })
    .then(function (categories) {
      return res.json(categories);
    });
});

//delete room category
roomRouter
  .route("/delete-roomCategory/:category_id")
  .delete(verifyJwt, (req, res) => {
    try {
      RoomCategory.findByIdAndDelete(req.params.category_id).then(function (
        deletedCategory
      ) {
        if (deletedCategory) {
          return res.json({ deletedCategory: "deleted" });
        }
        return res.json({ error: "category not found" });
      });
    } catch (error) {
      return res.json({ error: "error" });
    }
  });

//new room feature
roomRouter.route("/add-roomFeature").post(verifyJwt, (req, res) => {
  try {
    const feature = new RoomFeature(req.body);
    feature.save();
    return res.status(210).json(feature);
  } catch (error) {
    return res.json({ error: "can't add" });
  }
});

//room features list
roomRouter.route("/room-features-list").get((req, res) => {
  RoomFeature.find()
    .sort({ name: 1 })
    .then(function (features) {
      return res.json(features);
    });
});

//new room
roomRouter.route("/add-newRoom").post(async (req, res) => {
  try {
    const { number, capacity, category, features, price } = req.body;

    const existingRoom = await RoomModel.findOne({ number });
    if (existingRoom) {
      return res
        .status(400)
        .json({ message: "Room with this number already exists" });
    }

    const categoryExists = await RoomCategoryModel.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const validFeatures = await RoomFeaturesModel.find({
      _id: { $in: features },
    });
    if (validFeatures.length !== features.length) {
      return res.status(400).json({ message: "Features are invalid" });
    }

    const newRoom = new RoomModel({
      number,
      capacity,
      category,
      features,
      price,
    });
    await newRoom.save();

    res.status(201).json({ message: "Room added successfully", room: newRoom });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
});

//all rooms
roomRouter.route("/room-list").get(async (req, res) => {
  try {
    const rooms = await RoomModel.find()
      .sort({ number: 1 })
      .populate("category", "name")
      .populate("features", "name");

    const formattedRooms = rooms.map((room) => ({
      ...room.toObject(),
      price: parseFloat(room.price),
    }));

    res.json(formattedRooms);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching rooms", error: error.message });
  }
});

//delete room
roomRouter.route("/delete-room/:room_id").delete(verifyJwt, (req, res) => {
  try {
    RoomModel.findByIdAndDelete(req.params.room_id).then(function (
      deletedRoom
    ) {
      if (deletedRoom) {
        return res.json({ deletedRoom: "deleted" });
      }
      return res.json({ error: "room not found" });
    });
  } catch (error) {
    return res.json({ error: "error" });
  }
});
module.exports = roomRouter;
