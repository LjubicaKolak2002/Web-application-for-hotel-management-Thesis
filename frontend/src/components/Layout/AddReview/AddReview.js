import React, { useState, useEffect } from "react";
import { Rating } from "react-simple-star-rating";
import SubmitBtn from "../../UI/SubmitBtn/SubmitBtn";
import Textarea from "../../UI/Textarea/Textarea";
import MainLayout from "../MainLayout/MainLayout";
import { useNavigate } from "react-router-dom";
import "./AddReview.scss";

const AddReview = () => {
  const [rating, setRating] = useState(0);

  const [ratingResetKey, setRatingResetKey] = useState(0);
  const [comment, setComment] = useState("");
  const [role, setRole] = useState("");
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = JSON.parse(userString);
  const userId = user.id;
  const navigate = useNavigate();

  if (!token) {
    window.location.href = "/login";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:5200/api/add-review", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, rating, comment }),
    }).then(() => {
      navigate("/reviews");
    });
    setRating(0);
    setRatingResetKey((prev) => prev + 1);
    setComment("");
  };

  const handleRating = (rate) => {
    setRating(rate);
  };

  useEffect(() => {
    if (userString) {
      const user = JSON.parse(userString);
      setRole(user.role);
    }
  }, []);

  return (
    <div
      className={`add-review-main ${
        role === "admin" ? "add-review-main-admin" : ""
      }`}
    >
      <MainLayout>
        <div className="add-review">
          <header className="add-review-header">Write a review</header>

          <form onSubmit={handleSubmit} className="add-review-form">
            <label>Comment:</label>
            <Textarea
              placeholder="Write your comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />

            <label>Rating:</label>
            <Rating
              key={ratingResetKey}
              onClick={handleRating}
              rating={rating}
            />

            <SubmitBtn label="Add review" />
          </form>
        </div>
      </MainLayout>
    </div>
  );
};

export default AddReview;
