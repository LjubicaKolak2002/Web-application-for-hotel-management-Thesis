const express = require("express");
const { signJwt, verifyJwt } = require("../jwt.js");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ReviewModel = require("../models/ReviewModel.js");

const reviewRouter = express.Router();

//create review
reviewRouter.route("/add-review").post(verifyJwt, async (req, res) => {
  try {
    const { userId, rating, comment } = req.body;

    const review = new ReviewModel({
      user: userId,
      rating,
      comment,
    });

    await review.save();
    res.json({ message: "Review added" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error." });
  }
});

//all reviews
reviewRouter.route("/reviews").get(async (req, res) => {
  try {
    const reviews = await ReviewModel.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "name surname country",
        populate: {
          path: "country",
          select: "name code",
        },
      });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
});

//remove review
reviewRouter
  .route("/remove-review/:review_id")
  .delete(verifyJwt, (req, res) => {
    try {
      ReviewModel.findByIdAndDelete(req.params.review_id).then(function (
        deletedReview
      ) {
        if (deletedReview) {
          return res.json({ deletedReview: "deleted" });
        }
        return res.json({ error: "review not found" });
      });
    } catch (error) {
      return res.json({ error: "error" });
    }
  });
module.exports = reviewRouter;
