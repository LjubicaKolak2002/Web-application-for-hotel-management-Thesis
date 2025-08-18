const express = require("express");
const RoomModel = require("../models/RoomModel.js");
const BookingModel = require("../models/BookingModel.js");
const ReviewModel = require("../models/ReviewModel.js");

const statisticsRouter = express.Router();

async function getStatistics(year) {
  year = parseInt(year, 10);
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const rooms = await RoomModel.find({}, "_id").lean();
  const existingRoomIds = new Set(rooms.map((r) => r._id.toString()));
  const totalRooms = rooms.length;

  const bookings = await BookingModel.find({
    status: { $in: ["reserved", "checked in", "checked out"] },
    checkIn: { $exists: true },
    checkOut: { $exists: true },
  }).lean();

  const bookingsLast30ForIncome = bookings.filter((b) => {
    if (!b.checkIn) return false;
    const ci = new Date(b.checkIn);
    return ci >= thirtyDaysAgo && ci <= now;
  });

  let earningsLast30 = 0;
  bookingsLast30ForIncome.forEach((b) => {
    earningsLast30 += parseFloat(b.totalPrice.toString());
  });

  const bookingCountLast30 = bookingsLast30ForIncome.length;

  const monthlyIncome = Array(12).fill(0);
  let totalIncome = 0;

  bookings
    .filter((b) => {
      if (!b.checkIn) return false;
      const ci = new Date(b.checkIn);
      if (isNaN(ci.getTime())) return false;
      return ci.getFullYear() === year;
    })
    .forEach((b) => {
      let price = 0;
      if (b.totalPrice && typeof b.totalPrice.toString === "function") {
        price = parseFloat(b.totalPrice.toString());
      } else if (typeof b.totalPrice === "number") {
        price = b.totalPrice;
      } else if (typeof b.totalPrice === "string") {
        price = parseFloat(b.totalPrice);
      }
      if (!Number.isFinite(price)) price = 0;

      totalIncome += price;
      const monthIndex = new Date(b.checkIn).getMonth();
      monthlyIncome[monthIndex] += price;
    });

  const activeBookings = bookings.filter((b) => b.status === "checked in");
  console.log("active", activeBookings);
  const totalAdults = activeBookings.reduce(
    (sum, b) => sum + (b.adults || 0),
    0
  );
  const totalBabies = activeBookings.reduce(
    (sum, b) => sum + (b.babies || 0),
    0
  );

  const availableRooms = await RoomModel.countDocuments({
    status: { $nin: ["occupied", "blocked"] },
  });

  const occupiedCount = await RoomModel.countDocuments({ status: "occupied" });
  const occupancyRateOverall =
    totalRooms > 0 ? (occupiedCount / totalRooms) * 100 : 0;

  const roomsBookedLast30 = new Set();

  bookings.forEach((b) => {
    const ci = new Date(b.checkIn);
    const co = new Date(b.checkOut);

    if (ci <= now && co >= thirtyDaysAgo) {
      const roomIdStr = b.room.toString();
      if (existingRoomIds.has(roomIdStr)) {
        roomsBookedLast30.add(roomIdStr);
      }
    }
  });

  const occupancyRateLast30 =
    totalRooms > 0 ? (roomsBookedLast30.size / totalRooms) * 100 : 0;

  const allReviews = await ReviewModel.find({}, "rating createdAt").lean();
  let reviewsCountLast30 = 0;
  let ratingSumAll = 0;

  allReviews.forEach((r) => {
    ratingSumAll += r.rating;
    const created = new Date(r.createdAt);
    if (created >= thirtyDaysAgo && created <= now) {
      reviewsCountLast30 += 1;
    }
  });

  const reviewsAverageAll =
    allReviews.length > 0 ? ratingSumAll / allReviews.length : 0;

  const statusCounts = await RoomModel.aggregate([
    { $match: { status: { $in: ["dirty", "clean", "blocked"] } } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const roomStatusCounts = { dirty: 0, clean: 0, blocked: 0 };
  statusCounts.forEach(({ _id, count }) => {
    roomStatusCounts[_id] = count;
  });

  return {
    year,
    totalIncome,
    monthlyIncome,
    earningsLast30,
    bookingCountLast30,
    totalAdults,
    totalBabies,
    availableRooms,
    occupancyRateOverall,
    occupancyRateLast30,
    reviewsCountLast30,
    reviewsAverageAll,
    roomStatusCounts,
    totalRooms,
  };
}

statisticsRouter.route("/statistics").get(async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const stats = await getStatistics(year);
    return res.json(stats);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Greška prilikom dohvaćanja statistike" });
  }
});

module.exports = statisticsRouter;
