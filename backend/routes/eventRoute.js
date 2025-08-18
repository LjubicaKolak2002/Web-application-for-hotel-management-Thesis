const express = require("express");
const { signJwt, verifyJwt } = require("../jwt.js");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const EventModel = require("../models/EventModel.js");
const UsersEventsModel = require("../models/UsersEvents.js");
const UserModel = require("../models/UserModel.js");
const QRCode = require("qrcode");

const sendEmail = require("../utils/sendEmail.js");

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
eventRouter.route("/events/:event_id").get((req, res) => {
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

//event registration
eventRouter
  .route("/event-register/:event_id")
  .post(verifyJwt, async (req, res) => {
    try {
      const userId = req.body.user_id;
      const eventId = req.params.event_id;

      const event = await EventModel.findById(eventId);
      if (!event) return res.json({ message: "Event not found" });

      if (event.availableSpots <= 0) {
        return res.json({ message: "No available spots." });
      }

      const alreadyRegistered = await UsersEventsModel.findOne({
        user: userId,
        event: eventId,
      });
      if (alreadyRegistered) {
        return res.json({
          message: "The user is already registered for the event.",
        });
      }

      const registration = new UsersEventsModel({
        user: userId,
        event: eventId,
      });
      await registration.save();

      const user = await UserModel.findById(userId);
      const qrText = `Guest: ${user.name} ${user.surname}\nEvent: ${event.name}\nGuest code: ${user._id}\nEvent code: ${event._id}`;
      const qrCodeDataUrl = await QRCode.toDataURL(qrText);

      if (user && user.email) {
        const subject = "Event Registration Confirmation";
        const html = `
        <h3>Dear ${user.name},</h3>

        <p>Thank you for registering for our event: <strong>${event.name}</strong>.</p>

        <p>Below is your personal QR code to show at the entrance:</p>
        <p><img src="${qrCodeDataUrl}" alt="QR Code" /></p>


        <p>We look forward to seeing you there!</p>

        <p>Best regards,<br/>Hotelio Team</p>
      `;

        sendEmail(user.email, subject, html);
      }

      event.availableSpots -= 1;
      await event.save();

      return res.json({ message: "Successfully registered." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error", error: err.message });
    }
  });

//check registration to display button
eventRouter
  .route("/check-registration/:event_id/:user_id")
  .get(verifyJwt, async (req, res) => {
    const { event_id, user_id } = req.params;

    const existing = await UsersEventsModel.findOne({
      event: event_id,
      user: user_id,
    });

    res.json({ registered: !!existing });
  });

//users on event
eventRouter
  .route("/users-on-event/:event_id")
  .get(verifyJwt, async (req, res) => {
    try {
      const usersEvents = await UsersEventsModel.find({
        event: req.params.event_id,
      }).populate("user");

      console.log(usersEvents);

      const users = usersEvents.map((userEvent) => userEvent.user);

      return res.json(users);
    } catch (error) {
      console.log(error);
      return res.json({ message: error });
    }
  });

module.exports = eventRouter;
