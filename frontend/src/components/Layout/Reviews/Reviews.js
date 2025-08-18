import React, { useState, useEffect } from "react";
import { Rating } from "react-simple-star-rating";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./Reviews.scss";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [idx, setIdx] = useState(0);

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);

  const [role, setRole] = useState("");

  const userString = localStorage.getItem("user");

  useEffect(() => {
    fetch("http://localhost:5200/api/reviews")
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch(console.error);

    if (userString) {
      const user = JSON.parse(userString);
      setRole(user.role);
    }
  }, [token]);

  if (!reviews.length) {
    return (
      <div className="reviewsContainer no-data">
        <p className="noReviews-p">No available reviews.</p>
        {isLoggedIn && (
          <div className="addReview">
            <Link to="/add-review">Add new review</Link>
          </div>
        )}
      </div>
    );
  }

  const review = reviews[idx];
  const { user: reviewer, rating, comment, createdAt } = review;
  const flagCode = reviewer?.country?.code?.toLowerCase();
  const prev = () => setIdx((i) => (i === 0 ? reviews.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === reviews.length - 1 ? 0 : i + 1));

  return (
    <div
      className={`reviewsContainer ${
        role === "admin" ? "admin-reviewsContainer" : ""
      }`}
    >
      <h2>Reviews from our guests</h2>

      <div className="slider">
        <button className="arrow left" onClick={prev}>
          <ChevronLeft size={40} />
        </button>

        <div className="reviewCard">
          <div className="reviewHeader">
            {flagCode && (
              <img
                className="flag"
                src={`https://flagcdn.com/24x18/${flagCode}.png`}
                alt={reviewer.country.name}
                width="24"
                height="18"
              />
            )}
            <div className="reviewerInfo">
              <span className="reviewerName">
                {reviewer.name} {reviewer.surname}
              </span>
              <span className="reviewerEmail">{reviewer.email}</span>
            </div>
            <span className="reviewDate">
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="ratingWrapper">
            <Rating readonly initialValue={rating} size={20} />
            <span className="ratingValue">{Math.round(rating)}/5</span>
          </div>

          <p className="comment">“{comment}”</p>
        </div>

        <button className="arrow right" onClick={next}>
          <ChevronRight size={40} />
        </button>
      </div>

      {isLoggedIn && (
        <div className="addReview">
          <Link to="/add-review">Add new review</Link>
        </div>
      )}
    </div>
  );
};

export default Reviews;
