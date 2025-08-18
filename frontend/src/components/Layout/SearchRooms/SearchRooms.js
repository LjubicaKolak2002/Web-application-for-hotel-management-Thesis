import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DateInput from "../../UI/Date/Date";
import "./SearchRooms.scss";
import reservationImage from "../../pictures/purple.jpg";

const SearchRooms = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [capacity, setCapacity] = useState(1);
  const navigate = useNavigate();

  function handleSubmit() {
    navigate(
      `/available-rooms-results?checkIn=${checkIn}&checkOut=${checkOut}&capacity=${capacity}`
    );
  }

  return (
    <div
      className="container"
      style={{ backgroundImage: `url(${reservationImage})` }}
    >
      <h3>Find your perfect stay.</h3>
      <div className="form">
        <div className="inputGroup">
          <label className="label">Check In</label>
          <div className="date-input-wrapper">
            <DateInput
              className="date-input"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              minDate={new Date()}
            />
            <i className="fa-solid fa-calendar calendar-icon2"></i>
          </div>
        </div>

        <div className="inputGroup">
          <label className="label">Check Out</label>
          <div className="date-input-wrapper">
            <DateInput
              className="date-input"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              minDate={checkIn ? new Date(checkIn) : new Date()}
            />
            <i className="fa-solid fa-calendar calendar-icon2"></i>
          </div>
        </div>

        <div className="capacity">
          <label className="label">Guests</label>
          <div className="counter">
            <button
              onClick={() => setCapacity((prev) => Math.max(1, prev - 1))}
            >
              -
            </button>
            <span>{capacity}</span>
            <button onClick={() => setCapacity((prev) => prev + 1)}>+</button>
          </div>
        </div>

        <button className="search-button" onClick={handleSubmit}>
          Next
        </button>
      </div>
    </div>
  );
};

export default SearchRooms;
