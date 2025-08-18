/* import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Input from "../../UI/Input/Input";
import SubmitBtn from "../../UI/SubmitBtn/SubmitBtn";
import ConfirmationModal from "../../UI/Modal/Modal";
import { PayPalButtons } from "@paypal/react-paypal-js";

import Checkbox from "../../UI/Checkbox/Checkbox";

const BookingForm = () => {
  const { room_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [adults, setAdults] = useState(2);
  const [babies, setBabies] = useState(0);
  const [meals, setMeals] = useState([]);
  const [totalPrice, setTotalPrice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const { checkIn, checkOut } = location.state;
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.id;
  const token = localStorage.getItem("token");
  const [allData, setAllData] = useState([])

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
    setMeals((prev) => prev.includes(meal)
      ? prev.filter((m) => m !== meal)
      : [...prev, meal]
    );
  };

  const handlePreview = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5200/api/calculate-price", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          roomId: room_id,
          checkIn,
          checkOut,
          adults,
          babies,
          meals,
        }),
      });
  
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
          adults,
          babies,
          meals,
        }),
      });

      if (response.ok) {
        navigate("/"); 
      } else {
        alert("Booking failed.");
      }
    } catch (err) {
      console.error("Error booking room", err);
    }
  };

  return (
    <>
      <form onSubmit={handlePreview}>
        <h2>Booking Form</h2>
        <p>Check-in: {checkIn}</p>
        <p>Check-out: {checkOut}</p>

        <label>
          Adults:
          <Input
            value={adults}
            onChange={(e) => setAdults(+e.target.value)}
            placeholder="Adults"
            name="number"
          />
        </label>

        <label>
          Babies:
          <Input
            value={babies}
            onChange={(e) => setBabies(+e.target.value)}
            placeholder="Babies"
            name="number"
          />
        </label>

        <div>
          <label>
            <input
              type="checkbox"
              onChange={() => toggleMeal("breakfast")}
              checked={meals.includes("breakfast")}
            />
            Breakfast
          </label>
          <label>
            <input
              type="checkbox"
              onChange={() => toggleMeal("lunch")}
              checked={meals.includes("lunch")}
            />
            Lunch
          </label>
          <label>
            <input
              type="checkbox"
              onChange={() => toggleMeal("dinner")}
              checked={meals.includes("dinner")}
            />
            Dinner
          </label>
        </div>

        <SubmitBtn label="Confirm reservation" />
      </form>

      <ConfirmationModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={handleConfirmBooking}
        title="Confirm Your Booking"
        body={
          <>
            <p><strong>Room Price:</strong> {allData.roomPrice}€</p>
            <p><strong>Extra babies:</strong> {allData.extraBabiesPrice}€</p>
            <p>1 baby cot is free of charge</p>
            <p><strong>Meal plan:</strong> {allData.mealPrice}€</p>
            <p><strong>Total Price:</strong> <strong>{totalPrice}€</strong></p>

            {!paymentCompleted ? (
              <div style={{ marginTop: "20px" }}>
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: totalPrice.toString(),
                        },
                      },
                    ],
                  });
                }}
        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
            setPaymentCompleted(true);
            handleConfirmBooking(); // automatski napravi rezervaciju kad je plaćanje gotovo
          });
        }}
        onError={(err) => {
          console.error("PayPal error:", err);
          alert("There was a problem with PayPal.");
        }}
      />

        </div>
      ) : (
        <p style={{ color: "green", marginTop: "15px" }}>
          ✅ Payment completed. Finalizing your booking...
        </p>
      )}
    </>
  }
  confirmLabel="Confirm Booking"
  closeLabel="Cancel"
/>

    </>
  );
};

export default BookingForm;
 */

import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Input from "../../UI/Input/Input";
import SubmitBtn from "../../UI/SubmitBtn/SubmitBtn";
import ConfirmationModal from "../../UI/Modal/Modal";
import Checkout from "../../UI/Checkout/Checkout";
import Checkbox from "../../UI/Checkbox/Checkbox";

const BookingForm = () => {
  const { room_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [adults, setAdults] = useState(2);
  const [babies, setBabies] = useState(0);
  const [meals, setMeals] = useState([]);
  const [totalPrice, setTotalPrice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [allData, setAllData] = useState({});

  const { checkIn, checkOut } = location.state;
  const userData = JSON.parse(localStorage.getItem("user"));
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

  const handlePreview = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5200/api/calculate-price", {
        method: "POST",
        headers: options.headers,
        body: JSON.stringify({
          roomId: room_id,
          checkIn,
          checkOut,
          adults,
          babies,
          meals,
        }),
      });

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
          adults,
          babies,
          meals,
        }),
      });

      if (response.ok) {
        navigate("/");
      } else {
        alert("Booking failed.");
      }
    } catch (err) {
      console.error("Error booking room", err);
    }
  };

  return (
    <>
      <form onSubmit={handlePreview}>
        <h2>Booking Form</h2>
        <p>Check-in: {checkIn}</p>
        <p>Check-out: {checkOut}</p>

        <label>
          Adults:
          <Input
            value={adults}
            onChange={(e) => setAdults(+e.target.value)}
            placeholder="Adults"
            name="number"
          />
        </label>

        {/* <label>
          Babies:
          <Input
            value={babies}
            onChange={(e) => setBabies(+e.target.value)}
            placeholder="Babies"
            name="number"
          />
        </label> */}

        <SubmitBtn
          onClick={() => setBabies((prev) => Math.max(1, prev - 1))}
          disabled={babies <= 1}
          label="-"
        />
        <span>{babies}</span>
        <SubmitBtn onClick={() => setBabies((prev) => prev + 1)} label="+" />
        <span style={{ margin: "0 10px" }}></span> {/* za razmak */}

        <div>
          <label>
            <input
              type="checkbox"
              onChange={() => toggleMeal("breakfast")}
              checked={meals.includes("breakfast")}
            />
            Breakfast
          </label>
          <label>
            <input
              type="checkbox"
              onChange={() => toggleMeal("lunch")}
              checked={meals.includes("lunch")}
            />
            Lunch
          </label>
          <label>
            <input
              type="checkbox"
              onChange={() => toggleMeal("dinner")}
              checked={meals.includes("dinner")}
            />
            Dinner
          </label>
        </div>

        <SubmitBtn label="Confirm reservation" />
      </form>

      <ConfirmationModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        // handleConfirm={handleConfirmBooking} TO DO OVO SAMO PRIVREMENO OVDJE DOK PAYPAL NE DORADIM
        title="Confirm Your Booking"
        body={
          <>
            <p><strong>Room Price:</strong> {allData.roomPrice}€</p>
            <p><strong>Extra babies:</strong> {allData.extraBabiesPrice}€</p>
            <p>1 baby cot is free of charge</p>
            <p><strong>Meal plan:</strong> {allData.mealPrice}€</p>
            <p><strong>Total Price:</strong> <strong>{totalPrice}€</strong></p>

            {!paymentCompleted ? (
              <Checkout
                amount={totalPrice}
                onSuccess={() => {
                  setPaymentCompleted(true);
                  handleConfirmBooking();
                }}
              />
            ) : (
              <p style={{ color: "green", marginTop: "15px" }}>
                ✅ Payment completed. Finalizing your booking...
              </p>
            )}
          </>
        }
        confirmLabel="Confirm Booking"
        closeLabel="Cancel"
      />
    </>
  );
};

export default BookingForm;