import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import "./Pastreservations.scss";

const PastReservations = () => {
  const [reservations, setReservations] = useState([]);
  const token = localStorage.getItem("token");

  const { user_id } = useParams();

  console.log("user id", user_id);
  if (!token) {
    window.location.href = "/login";
  }

  const options = { headers: { Authorization: "Bearer " + token } };

  async function getReservations() {
    const response = await fetch(
      `http://localhost:5200/api/past_reservations/${user_id}`,
      options
    );
    console.log(response);

    const json = await response.json();
    console.log(json);
    setReservations(json);
    console.log(reservations);
  }

  useEffect(() => {
    getReservations();
  }, []);

  return (
    <div className="past-reservations-container">
      <h2>My Past Reservations</h2>
      <div className="pastResList">
        {reservations.length ? (
          reservations.map((res) => (
            <div key={res._id} className="resCardItem">
              <div className="resHeader">
                <span className="roomNumber">Room {res.room.number}</span>

                <span
                  className={
                    "status " + res.status.toLowerCase().replace(/\s+/g, "-")
                  }
                >
                  {res.status}
                </span>
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
            </div>
          ))
        ) : (
          <p className="noRes">No past reservations.</p>
        )}
      </div>
    </div>
  );
};

export default PastReservations;
