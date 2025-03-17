const express = require("express");
const { signJwt, verifyJwt } = require("../jwt.js");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const EventModel = require("../models/EventModel.js");
const multer = require("multer");

const eventRouter = express.Router();

//new event
eventRouter.route("/add-event").post(verifyJwt, (req, res) => {
  try {
    const event = new EventModel(req.body);
    event.save();
    return res.status(210).json(event);
  } catch (error) {
    return res.json({ error: "can't add new event" });
  }
});

//all events
eventRouter.route("/events-list").get((req, res) => {
  EventModel.find()
    .sort({ datetime: 1 })
    .then(function (events) {
      return res.json(events);
    });
});

module.exports = eventRouter;
