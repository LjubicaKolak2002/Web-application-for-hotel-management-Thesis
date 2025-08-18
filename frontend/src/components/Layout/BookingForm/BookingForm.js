import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Input from "../../UI/Input/Input";
import SubmitBtn from "../../UI/SubmitBtn/SubmitBtn";
import ConfirmationModal from "../../UI/Modal/Modal";
import Checkout from "../../UI/Checkout/Checkout";
import Checkbox from "../../UI/Checkbox/Checkbox";
import { mealOptions } from "../../../utils/constants";
import { formatDate } from "../../../utils/validation";
import "./BookingForm.scss";

const BookingForm = () => {
  const { room_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [babies, setBabies] = useState(0);
  const [meals, setMeals] = useState([]);
  const [totalPrice, setTotalPrice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [allData, setAllData] = useState({});

  const { checkIn, checkOut, capacity } = location.state;
  console.log(location.state);
  console.log(capacity, checkIn);

  const userData = JSON.parse(localStorage.getItem("user"));
  console.log("data", userData);
  const userId = userData?.id;
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
  }

  const options = {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json;charset=UTF-8",
    },
  };

  const toggleMeal = (meal) => {
    setMeals((prev) =>
      prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal]
    );
  };

  const handleCheckboxChange = (e) => {
    toggleMeal(e.target.value);
  };

  console.log("data", allData);
  console.log("meals state", meals);

  const handlePreview = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5200/api/calculate-price",
        {
          method: "POST",
          headers: options.headers,
          body: JSON.stringify({
            roomId: room_id,
            checkIn,
            checkOut,
            capacity,
            babies,
            meals,
          }),
        }
      );

      const data = await response.json();
      setAllData(data);
      setTotalPrice(data.totalPrice);
      setShowModal(true);
    } catch (err) {
      console.error("Error calculating price", err);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      const response = await fetch("http://localhost:5200/api/book-room", {
        method: "POST",
        headers: options.headers,
        body: JSON.stringify({
          userId,
          roomId: room_id,
          checkIn,
          checkOut,
          adults: capacity,
          babies,
          meals,
          totalPrice: totalPrice,
        }),
      });

      if (response.ok) {
        navigate(`/booking-confirmation/${userId}`);
      } else {
        alert("Booking failed.");
      }
    } catch (err) {
      console.error("Error booking room", err);
    }
  };

  return (
    <div className="reservationContainer">
      <div className="bookingForm">
        <form onSubmit={handlePreview}>
          <p>Select additional options to complete your reservation.</p>
          <p className="checkIn">
            <label>Check-in:</label> {formatDate(checkIn)}
          </p>
          <p className="checkOut">
            <label>Check-out:</label> {formatDate(checkOut)}
          </p>

          <p className="adults">{capacity} adult guests</p>

          <div className="counterBaby">
            <div className="textPart">
              <h5>Babies</h5>
              <p>The maximum number of baby cots is 3.</p>
            </div>
            <Input
              type="number"
              min={0}
              max={3}
              value={babies}
              onChange={(e) =>
                setBabies(Math.min(3, Math.max(0, +e.target.value)))
              }
              placeholder="Babies"
              name="number"
            />
          </div>

          <div className="mealPlan">
            <p>Include meals:</p>
            <div className="checkbox-group">
              <Checkbox
                className="meals-checkbox"
                options={mealOptions}
                name="meals"
                value={meals}
                onChange={handleCheckboxChange}
              />
            </div>
          </div>

          {!showPayment && (
            <div className="submitBtn">
              <SubmitBtn label="Check the price" className="check-price" />
            </div>
          )}
        </form>

        <ConfirmationModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          handleConfirm={() => {
            setShowModal(false);
            setShowPayment(true);
          }}
          //handleConfirm={handleConfirmBooking} TO DO OVO SAMO PRIVREMENO OVDJE DOK PAYPAL NE DORADIM
          title="Price details"
          body={
            <>
              <p>
                <strong>Room Price:</strong> {allData.roomPrice}€
              </p>
              <p>
                <strong>Extra beds for babies:</strong>{" "}
                {allData.extraBabiesPrice}€
              </p>
              <p>1 baby cot is free of charge</p>
              <p>
                <strong>Meal plan:</strong> {allData.mealPrice}€
              </p>
              <p>
                <strong>Total Price:</strong> <strong>{totalPrice}€</strong>
              </p>
              <p>If you agree with this price, go to the payment step.</p>
            </>
          }
          confirmLabel="Payment"
          closeLabel="Cancel"
        />
      </div>
      <div className="paymentForm">
        {showPayment && !paymentCompleted && (
          <Checkout
            amount={totalPrice}
            onSuccess={() => {
              setPaymentCompleted(true);
              handleConfirmBooking();
            }}
          />
        )}

        {paymentCompleted && (
          <p style={{ color: "green", marginTop: "15px" }}>
            Payment completed.
          </p>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
