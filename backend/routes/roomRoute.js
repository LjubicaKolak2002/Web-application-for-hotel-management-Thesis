const express = require("express");
const RoomCategory = require("../models/RoomCategoryModel.js");
const RoomFeature = require("../models/RoomFeaturesModel.js");
const { signJwt, verifyJwt } = require("../jwt.js");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const RoomModel = require("../models/RoomModel.js");
const RoomCategoryModel = require("../models/RoomCategoryModel.js");
const RoomFeaturesModel = require("../models/RoomFeaturesModel.js");
const RoomTypeModel = require("../models/RoomTypeModel.js");

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

//new room type
roomRouter.route("/add-roomType").post(verifyJwt, (req, res) => {
  try {
    const type = new RoomTypeModel(req.body);
    type.save();
    return res.status(210).json(type);
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

//room types list
roomRouter.route("/room-types-list").get((req, res) => {
  RoomTypeModel.find().then(function (types) {
    return res.json(types);
  });
});

//new room
roomRouter.route("/add-newRoom").post(async (req, res) => {
  try {
    const {
      number,
      capacity,
      category,
      type,
      features,
      price,
      blockReason = "",
    } = req.body;

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

    const typeExists = await RoomTypeModel.findById(type);
    if (!typeExists) {
      return res.status(400).json({ message: "Invalid room type ID" });
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
      type,
      features,
      price,
      blockReason,
    });

    await newRoom.save();

    res.status(201).json({ message: "Room added successfully", room: newRoom });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
});

//edit root
roomRouter.route("/edit-room/:room_id").put(verifyJwt, (req, res) => {
  try {
    RoomModel.findOneAndUpdate({ _id: req.params.room_id }, req.body, {
      new: true,
    })
      .then((updatedRoom) => {
        if (!updatedRoom) {
          return res.json({ error: "Can't find this room" });
        }
        return res.json(updatedRoom);
      })
      .catch((error) => {
        return res.json({
          error: "Can't update this room",
          details: error.message,
        });
      });
  } catch (error) {
    return res.json({ error: "Unexpected error occurred" });
  }
});

//all rooms
roomRouter.route("/room-list").get(async (req, res) => {
  try {
    const rooms = await RoomModel.find()
      .sort({ number: 1 })
      .populate("category", "name")
      .populate("type", "name")
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

//room by id
roomRouter.route("/rooms/:room_id").get(verifyJwt, (req, res) => {
  const valid = mongoose.Types.ObjectId.isValid(req.params.room_id);
  if (!valid) {
    return res.json({});
  }
  RoomModel.findById(req.params.room_id).then(function (room) {
    return res.json(room);
  });
});

//block room
roomRouter.route("/block-room/:room_id").put(verifyJwt, async (req, res) => {
  try {
    const { blockReason } = req.body;
    const roomId = req.params.room_id;

    const room = await RoomModel.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.status === "blocked") {
      return res.status(400).json({ message: "Room is already blocked" });
    }

    room.status = "blocked";
    room.blockReason = blockReason;

    await room.save();

    res.json({ message: "Room successfully blocked", room });
  } catch (error) {
    res.status(500).json({ message: "Error blocking room" });
  }
});

roomRouter.route("/unblock-room/:room_id").put(verifyJwt, async (req, res) => {
  try {
    const roomId = req.params.room_id;

    const room = await RoomModel.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.status != "blocked") {
      return res.status(400).json({ message: "Room is not blocked" });
    }

    room.status = "free";
    room.blockReason = "";

    await room.save();

    res.json({ message: "Room successfully unblocked", room });
  } catch (error) {
    res.status(500).json({ message: "Error unblocking room" });
  }
});

module.exports = roomRouter;
