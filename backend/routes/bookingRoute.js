const express = require("express");
const { signJwt, verifyJwt } = require("../jwt.js");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const RoomModel = require("../models/RoomModel.js");
const BookingModel = require("../models/BookingModel.js");
const UserModel = require("../models/UserModel.js");
const sendEmail = require("../utils/sendEmail.js");

const bookingRouter = express.Router();

//available rooms for booking
bookingRouter.route("/available-rooms").get(async (req, res) => {
  try {
    const checkIn = new Date(req.query.checkIn);
    const checkOut = new Date(req.query.checkOut);
    const capacity = parseInt(req.query.capacity);
    const category = req.query.category;
    const type = req.query.type;
    const maxPrice = parseFloat(req.query.maxPrice);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const bookings = await BookingModel.find({
      status: { $in: ["checked in", "reserved"] },
    }); //TO DO, PROVJERITI RADI LI OVO UOPCE

    const rooms = await RoomModel.find()
      .populate("category", "name")
      .populate("type", "name")
      .populate("features", "name");

    const bookedRoomIds = bookings
      .filter((booking) => {
        const bookingCheckIn = new Date(booking.checkIn);
        const bookingCheckOut = new Date(booking.checkOut);
        const overlaps =
          (checkIn < bookingCheckOut && checkOut > bookingCheckIn) ||
          checkIn.getTime() === bookingCheckIn.getTime() ||
          checkOut.getTime() === bookingCheckOut.getTime();

        return overlaps;
      })
      .map((booking) => booking.room.toString());

    const availableRooms = rooms.filter((room) => {
      const roomId = room._id.toString();

      let isBooked = bookedRoomIds.includes(roomId);
      let statusOk = !["blocked"].includes(room.status);
      let capacityOk = room.capacity === capacity;
      let categoryOk = !category || room.category.equals(category);
      let typeOk = !type || room.type.equals(type);
      let priceOk = true;
      if (!isNaN(maxPrice)) {
        const roomPrice = parseFloat(room.price.toString());
        priceOk = roomPrice <= maxPrice;
      }

      return (
        !isBooked && statusOk && capacityOk && categoryOk && typeOk && priceOk
      );
    });

    const paginatedRooms = availableRooms.slice(skip, skip + limit);

    res.json({
      rooms: paginatedRooms,
      totalRooms: availableRooms.length,
      totalPages: Math.ceil(availableRooms.length / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while searching rooms" });
  }
});

//calculate price for reservation
bookingRouter.route("/calculate-price").post(verifyJwt, async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, capacity, babies, meals } = req.body;
    console.log("meals:", meals, capacity);

    const room = await RoomModel.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const oneDayMs = 24 * 60 * 60 * 1000;

    const msDiff = new Date(checkOut) - new Date(checkIn);

    const nightsNum = Math.floor(msDiff / oneDayMs);
    console.log("Cijena", nightsNum);

    const roomPrice = room.price * nightsNum;
    const extraBabies = babies > 1 ? babies - 1 : 0;
    const extraBabiesPrice = extraBabies * 7; //hoce li po broju noci ili ne?

    const mealPrices = {
      breakfast: 5,
      lunch: 10,
      dinner: 10,
    };

    let mealPrice = 0;

    //samo vecera prvi dan
    if (meals.includes("dinner")) {
      mealPrice += mealPrices["dinner"] * capacity;
    }

    //zadnji dan samo dorucak
    if (meals.includes("breakfast")) {
      mealPrice += mealPrices["breakfast"] * capacity;
    }

    //svi obroci
    if (nightsNum > 1) {
      const middleNights = nightsNum - 1;
      const fullMealPerNight = meals.reduce((total, meal) => {
        return total + (mealPrices[meal] || 0);
      }, 0);
      mealPrice += fullMealPerNight * capacity * middleNights;
      console.log("cijena", fullMealPerNight * capacity * middleNights);
    }

    const totalPrice = roomPrice + extraBabiesPrice + mealPrice;

    console.log("room", roomPrice);
    console.log("babies:", extraBabiesPrice);
    console.log("meal", mealPrice);

    res.status(200).json({
      totalPrice,
      roomPrice,
      extraBabiesPrice,
      mealPrice,
      totalPrice,
    });
  } catch (error) {
    console.error("Error calculating price:", error);
    res.status(500).json({ message: "Error calculating price" });
  }
});

//booking room
bookingRouter.route("/book-room").post(verifyJwt, async (req, res) => {
  try {
    const {
      roomId,
      userId,
      checkIn,
      checkOut,
      adults,
      babies,
      meals,
      totalPrice,
    } = req.body;

    const room = await RoomModel.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    console.log("BODY:", req.body);
    console.log("ROOM PRICE", room.price);

    const booking = new BookingModel({
      user: userId,
      room: roomId,
      checkIn,
      checkOut,
      adults,
      babies,
      meals,
      status: "reserved",
      totalPrice: totalPrice,
    });

    await booking.save();

    //postavi status sobe u reserved
    //room.status = "reserved"; TO DO OVO NEMA SMISLA
    //await room.save();

    const user = await UserModel.findById(userId);
    console.log(user);
    console.log("user mail:", user.email);
    if (user && user.email) {
      const subject = "Booking Confirmation";
      const html = `
    <h3>Dear ${user.name || "Guest"},</h3>
    <p>We’re pleased to confirm your reservation for <strong>Room ${
      room.number
    }</strong>.</p>

    <p>Here are the details of your stay:</p>
    <ul>
      <li><strong>Check-in:</strong> ${new Date(checkIn).toDateString()}</li>
      <li><strong>Check-out:</strong> ${new Date(checkOut).toDateString()}</li>
      <li><strong>Total Price:</strong> ${totalPrice}€</li>
    </ul>

    
    <p>Thank you for choosing us — we look forward to welcoming you!</p>

    <p>Best regards,<br>Hotelio Team</p>
  `;

      sendEmail(user.email, subject, html);
    }

    res.status(201).json({
      message: "Room booked successfully",
      booking,
      totalPrice: totalPrice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error booking room" });
  }
});

//future reservations
bookingRouter
  .route("/future_reservations/:user_id")
  .get(verifyJwt, (req, res) => {
    const valid = mongoose.Types.ObjectId.isValid(req.params.user_id);
    if (!valid) {
      return res.json({});
    }

    BookingModel.find({
      user: req.params.user_id,
      checkIn: { $gte: new Date() },
      status: "reserved",
    })
      .populate("room")
      .sort({ checkIn: 1 })
      .then(function (reservation) {
        return res.json(reservation);
      });
  });

//user past reservations
bookingRouter
  .route("/past_reservations/:user_id")
  .get(verifyJwt, (req, res) => {
    const valid = mongoose.Types.ObjectId.isValid(req.params.user_id);
    if (!valid) {
      return res.json({});
    }
    BookingModel.find({
      user: req.params.user_id,
      checkOut: { $lt: new Date() },
    })
      .populate("room")
      .sort({ checkIn: -1 })
      .then(function (reservation) {
        return res.json(reservation);
      });
  });

//cancel reservation
bookingRouter
  .route("/cancel-reservation/:reservation_id")
  .put(async (req, res) => {
    const valid = mongoose.Types.ObjectId.isValid(req.params.reservation_id);
    if (!valid) {
      return res.json({});
    }

    try {
      const reservation = await BookingModel.findById(
        req.params.reservation_id
      );
      if (!reservation) {
        return res.status(400).json({ message: "Reservation not found" });
      }

      if (reservation.status !== "reserved") {
        return res.json({
          message: "Only reservations with reserved status can be cancelled",
        });
      }

      const now = new Date();
      const checkInTime = new Date(reservation.checkIn);
      const diffInMs = checkInTime - now;
      const diffInHours = diffInMs / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return res.json({
          message:
            "Reservation can only be cancelled at least 24 hours before checkIn",
        });
      }

      reservation.status = "cancelled";
      await reservation.save();

      //postavi status sobe na cisto = slobodno
      const room = await RoomModel.findById(reservation.room);
      if (room) {
        //room.status = "free";
        room.status = "clean";
        await room.save();
      }

      return res.json({ reservation: reservation._id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error cancelling reservation" });
    }
  });

//checkIn and checkOut list
bookingRouter.route("/arrivals-departures").get(verifyJwt, async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.json({ error: "Date is required" });
    }

    console.log("DATUM", date);

    const dateString = new Date(date).toISOString().split("T")[0];
    console.log("datum:", dateString);
    const bookings = await BookingModel.find().populate("user room");

    const checkIns = bookings.filter((booking) => {
      const checkInString = new Date(booking.checkIn)
        .toISOString()
        .split("T")[0];
      return checkInString == dateString;
    });

    const checkOuts = bookings.filter((booking) => {
      const checkOutString = new Date(booking.checkOut)
        .toISOString()
        .split("T")[0]; //uklanja nule za sate
      return checkOutString == dateString;
    });

    checkIns.sort(
      (a, b) => parseInt(a.room?.number || 0) - parseInt(b.room?.number || 0)
    );
    checkOuts.sort(
      (a, b) => parseInt(a.room?.number || 0) - parseInt(b.room?.number || 0)
    );

    return res.json({ date: dateString, checkIns, checkOuts });
  } catch (error) {
    return res.json({ error: "Error" });
  }
});

//get reservation statuses, TO DO TRENUTNO NE KORISTIM, JER SAM STAVILA SAM STATUSE CHECK IN I CHEKOUT
bookingRouter
  .route("/reservation-statuses")
  .get(verifyJwt, async (req, res) => {
    const statusEnum = BookingModel.schema.path("status").enumValues;
    res.json(statusEnum);
  });

//check in and check out functionality
bookingRouter.route("/update-status/:id").patch(verifyJwt, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["checked in", "checked out"].includes(status)) {
      return res.json({ error: "Invalid status" });
    }

    const booking = await BookingModel.findById(id).populate("room");
    if (!booking) return res.json({ error: "Reservation not found" });

    booking.status = status;
    await booking.save();

    //promjena statusa sobe
    const room = await RoomModel.findById(booking.room._id);
    if (room) {
      room.status = status === "checked in" ? "occupied" : "dirty";
      await room.save();
    }

    res.json({ message: `Booking ${status}`, booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//available room for room change
bookingRouter
  .route("/available-rooms-for-removal")
  .get(verifyJwt, async (req, res) => {
    try {
      const { checkIn, checkOut, categoryId, typeId, capacity } = req.query;

      if (!checkIn || !checkOut) {
        return res.status(400).json({ error: "Missing date range." });
      }

      const start = new Date(checkIn);
      const end = new Date(checkOut);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ error: "Invalid date format." });
      }

      const capacityNum = capacity ? parseInt(capacity) : null;

      const reservedRoomIds = await BookingModel.find({
        checkIn: { $lt: end },
        checkOut: { $gt: start },
      }).distinct("room");

      console.log("RESERVED ROOMS:", reservedRoomIds);

      // sobe koje nisu blokirane i nisu rezervirane u periodu
      const allAvailableRooms = await RoomModel.find({
        _id: { $nin: reservedRoomIds },
        status: { $ne: "blocked" },
      }).populate("type category");

      console.log("Slobodne sobe:", allAvailableRooms);

      console.log("All available rooms:");
      allAvailableRooms.forEach((room) => {
        console.log(
          room._id,
          "type:",
          room.type?._id?.toString(),
          "category:",
          room.category?._id?.toString(),
          "capacity:",
          room.capacity
        );
      });

      console.log("Filters:", { typeId, categoryId, capacityNum });

      const matchingRooms = allAvailableRooms.filter(
        (room) =>
          room.type._id.toString() === typeId &&
          room.category._id.toString() === categoryId &&
          (capacityNum === null || room.capacity === capacityNum)
      );

      console.log("matching rooms", matchingRooms);

      const otherRooms = allAvailableRooms.filter(
        (room) =>
          room.type._id.toString() !== typeId ||
          room.category._id.toString() !== categoryId
        /*  &&
          (capacityNum !== null ? room.capacity === capacityNum : true) */
      );

      res.json({
        matching: matchingRooms,
        others: otherRooms,
      });
    } catch (err) {
      console.error("Error fetching available rooms for removal:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

//finctionality for change room
bookingRouter
  .route("/change-room/:bookingId")
  .put(verifyJwt, async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { newRoomId } = req.body;

      if (
        !mongoose.Types.ObjectId.isValid(bookingId) ||
        !mongoose.Types.ObjectId.isValid(newRoomId)
      ) {
        return res.status(400).json({ error: "Invalid id" });
      }

      const booking = await BookingModel.findById(bookingId);
      if (!booking) return res.status(404).json({ error: "Booking not found" });

      const newRoom = await RoomModel.findById(newRoomId);
      if (!newRoom)
        return res.status(404).json({ error: "New room not found" });

      //provjeriti je li soba dostupna
      const overlappingBookings = await BookingModel.find({
        room: newRoomId,
        _id: { $ne: bookingId },
        checkIn: { $lt: booking.checkOut },
        checkOut: { $gt: booking.checkIn },
      });

      if (overlappingBookings.length > 0) {
        return res
          .status(400)
          .json({ error: "Room is not available in that period." });
      }

      //update
      booking.room = newRoomId;
      await booking.save();

      res.json({ message: "Room changed successfully.", booking });
    } catch (err) {
      console.error("Error changing room:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

//get booking by id
bookingRouter.route("/bookings/:bookingId").get(verifyJwt, async (req, res) => {
  try {
    const booking = await BookingModel.findById(req.params.bookingId)
      .populate({
        path: "room",
        populate: ["type", "category"],
      })
      .populate("user");

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    console.error("Error fetching booking:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//remove room note (admin and head maid)
bookingRouter
  .route("/delete-room-note/:roomId/note")
  .patch(async (req, res) => {
    try {
      const { roomId } = req.params;
      const { note } = req.body;

      const room = await RoomModel.findByIdAndUpdate(
        roomId,
        { note },
        { new: true }
      );

      if (!room) return res.status(404).json({ error: "Room not found" });

      res.json(room);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

module.exports = bookingRouter;
