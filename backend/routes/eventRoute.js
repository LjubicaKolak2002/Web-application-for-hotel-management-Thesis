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

//event by id
eventRouter.route("/events/:event_id").get(verifyJwt, (req, res) => {
  const valid = mongoose.Types.ObjectId.isValid(req.params.event_id);
  if (!valid) {
    return res.json({});
  }
  EventModel.findById(req.params.event_id).then(function (event) {
    return res.json(event);
  });
});

//remove event
eventRouter.route("/remove-event/:event_id").delete(verifyJwt, (req, res) => {
  try {
    EventModel.findByIdAndDelete(req.params.event_id).then(function (
      deletedEvent
    ) {
      if (deletedEvent) {
        return res.json({ deletedEvent: "deleted" });
      }
      return res.json({ error: "event not found" });
    });
  } catch (error) {
    return res.json({ error: "error" });
  }
});

module.exports = eventRouter;
