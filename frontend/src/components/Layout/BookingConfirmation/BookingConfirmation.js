import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./BookingConfirmation.scss";

const BookingConfirmation = () => {
  const [email, setEmail] = useState("");
  const token = localStorage.getItem("token");
  const { user_id } = useParams();

  const options = { headers: { Authorization: "Bearer " + token } };
  async function getEmail() {
    const res = await fetch(
      `http://localhost:5200/api/user/${user_id}`,
      options
    );
    const data = await res.json();
    setEmail(data.email);
  }

  useEffect(() => {
    getEmail();
  }, []);

  return (
    <div className="confirmationPage">
      <div className="confirmCard">
        <h1>Your reservation has been confirmed!</h1>
        <p>
          Thank you for choosing our hotel for your vacation.
          <br />
          We have sent a confirmation to your email address:&nbsp;
          <strong>{email}</strong>.
        </p>
        <p>
          Please check your email <i className="fa-solid fa-envelope"></i>.
        </p>
        <Link to={`/my-future-reservations/${user_id}`} className="btn">
          My reservations
        </Link>
      </div>
    </div>
  );
};

export default BookingConfirmation;
