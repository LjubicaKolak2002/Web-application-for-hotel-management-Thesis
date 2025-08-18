import React, { useState, useEffect } from "react";
import { Rating } from "react-simple-star-rating";
import Button from "../../UI/Button/Button";
import ConfirmationModal from "../../UI/Modal/Modal";
import Pagination from "../../UI/Pagination/Pagination";
import "./AdminReviews.scss";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const token = localStorage.getItem("token");

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  const [showModal, setShowModal] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [modalError, setModalError] = useState("");

  const openDeleteModal = (id) => {
    setToDeleteId(id);
    setModalError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setToDeleteId(null);
    setModalError("");
  };

  if (!token) {
    window.location.href = "/login";
  }

  useEffect(() => {
    fetch("http://localhost:5200/api/reviews", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setReviews)
      .catch(console.error);
  }, [token]);

  async function handleDelete(id) {
    try {
      const res = await fetch(`http://localhost:5200/api/remove-review/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.deletedReview) {
        setReviews((prev) => prev.filter((r) => r._id !== id));
      } else {
        alert(json.error || "Delete failed");
      }
    } catch {
      alert("Network error");
    }
  }

  const indexOfLast = currentPage * reviewsPerPage;
  const indexOfFirst = indexOfLast - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirst, indexOfLast);

  return (
    <div className="adminReviewsContainer">
      <h1>All Guest Reviews</h1>
      {reviews.length === 0 ? (
        <p className="empty">No reviews found.</p>
      ) : (
        <ul className="reviewList">
          {currentReviews.map((r) => {
            const user = r.user || {};
            const country = user.country || {};
            const flagCode = country.code?.toLowerCase();
            return (
              <li key={r._id} className="reviewItem">
                <div className="topRow">
                  <div className="ratingRow">
                    <Rating readonly initialValue={r.rating} size={18} />
                    <span className="ratingValue">
                      {Math.round(r.rating)}/5
                    </span>
                  </div>
                  <div className="countryDisplay">
                    {flagCode && (
                      <img
                        className="flag"
                        style={{
                          border: "none",
                          outline: "none",
                          boxShadow: "none",
                        }}
                        src={`https://flagcdn.com/24x18/${flagCode}.png`}
                        alt={country.name}
                        width="24"
                        height="18"
                      />
                    )}
                    {country.name && (
                      <span className="country">{country.name}</span>
                    )}
                  </div>
                </div>

                <p className="body">{r.comment}</p>

                <div className="footerRow">
                  <span className="by">
                    by{" "}
                    <strong>
                      {user.name} {user.surname}
                    </strong>
                  </span>
                  <span className="when">
                    {new Date(r.createdAt).toLocaleString()}
                  </span>
                  <Button
                    variant="red"
                    onClick={() => openDeleteModal(r._id)}
                    label={<i className="fa-solid fa-trash" />}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="admin-reviews-pagination">
        <Pagination
          postsPerPage={reviewsPerPage}
          totalPosts={reviews.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>

      <ConfirmationModal
        show={showModal}
        handleClose={closeModal}
        title="Delete Review"
        body="Are you sure you want to delete this review?"
        confirmLabel="Yes"
        closeLabel="Cancel"
        handleConfirm={() => {
          handleDelete(toDeleteId);
          closeModal();
        }}
        error={modalError}
      />
    </div>
  );
};

export default AdminReviews;
