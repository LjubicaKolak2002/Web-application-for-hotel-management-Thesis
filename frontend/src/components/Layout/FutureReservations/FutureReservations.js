import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ConfirmationModal from "../../UI/Modal/Modal";
import "./FutureReservations.scss";

const FutureReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedRes, setSelectedRes] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");
  const { user_id } = useParams();

  if (!token) {
    window.location.href = "/login";
  }

  const options = { headers: { Authorization: "Bearer " + token } };

  async function getReservations() {
    const res = await fetch(
      `http://localhost:5200/api/future_reservations/${user_id}`,
      options
    );
    const data = await res.json();
    setReservations(data);
  }

  async function handleCancel() {
    if (!selectedRes) return;
    try {
      const response = await fetch(
        `http://localhost:5200/api/cancel-reservation/${selectedRes._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      console.log("Cancel response:", response.status, result);

      if (response.ok && result.reservation) {
        setReservations((prev) =>
          prev.filter((r) => r._id !== selectedRes._id)
        );
        setShowModal(false);
      } else {
        alert(result.message || "Could not cancel reservation.");
      }
    } catch (err) {
      console.error("Error cancelling:", err);
      alert("Network error, please try again.");
    }
  }

  useEffect(() => {
    getReservations();
  }, []);

  return (
    <div className="future-reservations-container">
      <h2>My future reservations</h2>
      <div className="futureResList">
        {reservations.length > 0 ? (
          reservations.map((res) => {
            //koliko je sati do check-ina
            const now = new Date();
            const checkInTime = new Date(res.checkIn);
            const diffInMs = checkInTime - now;
            const diffInHours = diffInMs / (1000 * 60 * 60);
            const canCancel = res.status === "reserved" && diffInHours >= 24;

            return (
              <div key={res._id} className="resCardItem">
                <div className="resHeader">
                  <span className="roomNumber">Room {res.room?.number}</span>
                  <span className={`status ${res.status}`}>{res.status}</span>
                </div>
                <div className="resBody">
                  <div>
                    <strong>Check-in:</strong>{" "}
                    {new Date(res.checkIn).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Check-out:</strong>{" "}
                    {new Date(res.checkOut).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Reserved:</strong>{" "}
                    {new Date(res.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Adults:</strong> {res.adults} &nbsp;|&nbsp;
                    <strong>Babies:</strong> {res.babies}
                  </div>
                  <div>
                    <strong>Meals:</strong>{" "}
                    {res.meals.length ? res.meals.join(", ") : "None"}
                  </div>
                  <div className="priceLine">
                    <strong>Price:</strong>{" "}
                    <span className="priceTag">
                      {res.totalPrice?.$numberDecimal
                        ? parseFloat(res.totalPrice.$numberDecimal).toFixed(2) +
                          " €"
                        : "N/A"}
                    </span>
                  </div>
                </div>

                {res.status === "reserved" && (
                  <div className="cancelWrapper">
                    {!canCancel && (
                      <span className="cancelNote">
                        (only ≥24h before check-in)
                      </span>
                    )}
                    <button
                      className="cancelBtn"
                      disabled={!canCancel}
                      title={
                        !canCancel
                          ? "Cancellations allowed at least 24h before check-in"
                          : "Cancel reservation"
                      }
                      onClick={() => {
                        if (canCancel) {
                          setSelectedRes(res);
                          setShowModal(true);
                        }
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="noRes">No future reservations.</p>
        )}
      </div>

      <ConfirmationModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={handleCancel}
        title="Cancel reservation"
        body="Are you sure you want to cancel this reservation?"
        confirmLabel="Yes"
        closeLabel="No"
      />
    </div>
  );
};

export default FutureReservations;
