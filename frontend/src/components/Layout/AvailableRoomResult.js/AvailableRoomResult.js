import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AvailableRoomResult.scss";
import Select from "../../UI/Select/Select";
import SubmitBtn from "../../UI/SubmitBtn/SubmitBtn";
import RangeInput from "../../UI/InputRange/InputRange";
import { formatDate } from "../../../utils/validation";

import Pagination from "../../UI/Pagination/Pagination";

const AvailableRoomsResults = () => {
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);

  const checkIn = params.get("checkIn");
  const checkOut = params.get("checkOut");
  const capacity = params.get("capacity");

  const [category, setCategory] = useState(params.get("category") || "");
  const [type, setType] = useState(params.get("type") || "");

  const [minDBPrice, setMinDBPrice] = useState("");
  const [maxDBPrice, setMaxDBPrice] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(
    params.get("maxPrice") || ""
  );

  const user = JSON.parse(localStorage.getItem("user"));

  // pagination
  const [currentPage, setCurrentPage] = useState(
    parseInt(params.get("page")) || 1
  );
  const roomsPerPage = 3;

  useEffect(() => {
    const getCategories = async () => {
      const res = await fetch("http://localhost:5200/api/categories-list");
      const data = await res.json();
      setCategories(data);
    };

    const getTypes = async () => {
      const res = await fetch("http://localhost:5200/api/room-types-list");
      const data = await res.json();
      setTypes(data);
    };

    const getMinMaxPrice = async () => {
      const res = await fetch("http://localhost:5200/api/min-max-price");
      console.log("rezultat", res);
      const data = await res.json();
      setMinDBPrice(data.min.price.$numberDecimal);
      setMaxDBPrice(data.max.price.$numberDecimal);
    };

    getCategories();
    getTypes();
    getMinMaxPrice();
  }, []);

  useEffect(() => {
    async function getRooms() {
      try {
        const queryParams = new URLSearchParams({
          checkIn,
          checkOut,
          capacity,
          page: currentPage,
          limit: roomsPerPage,
        });

        if (category) queryParams.append("category", category);
        if (type) queryParams.append("type", type);
        if (selectedPrice) queryParams.append("maxPrice", selectedPrice);

        navigate(`?${queryParams.toString()}`);

        const res = await fetch(
          `http://localhost:5200/api/available-rooms?${queryParams}`
        );
        const data = await res.json();
        setRooms(data.rooms);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Error:", err);
      }
    }

    if (checkIn && checkOut && capacity) {
      getRooms();
    }
  }, [
    checkIn,
    checkOut,
    capacity,
    category,
    type,
    selectedPrice,
    currentPage,
    navigate,
  ]);

  return (
    <div className="wrapper">
      <div className="searchBox">
        <h3>Your search</h3>
        <p>
          <label>Check-in date:</label>
          <span className="valueBox">{formatDate(checkIn)}</span>
        </p>
        <p>
          <label>Check-out date:</label>
          <span className="valueBox">{formatDate(checkOut)}</span>
        </p>
        <p>
          <label>Guests:</label>
          <span className="valueBox">{capacity}</span>
        </p>

        <div className="filters">
          <h3>More filters</h3>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={categories.map((category) => ({
              value: category._id,
              label: category.name,
            }))}
            name="category"
            placeholder="Select category"
          />

          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={types.map((type) => ({
              value: type._id,
              label: type.name,
            }))}
            name="type"
            placeholder="Select type"
          />

          <RangeInput
            label="Max price"
            min={minDBPrice}
            max={maxDBPrice}
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
          />
        </div>
      </div>

      <div className="results">
        <h2>Available Rooms</h2>
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div key={room._id} className="roomCard">
              {room.image && (
                <div className="roomImage">
                  <img src={room.image} alt={room.number} />
                </div>
              )}
              <div className="roomDetails">
                <h3>Room {room.number}</h3>
                <p>{room.category?.name}</p>
                <p>{room.type?.name}</p>

                <div className="features">
                  {room.features?.map((f) => (
                    <span key={f._id} className="featureButton">
                      {f.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="priceAndCapacity">
                <p className="price">
                  {room.price?.$numberDecimal ?? "N/A"} € per night
                </p>
                <p className="guests">Max {room.capacity} guests</p>

                {user ? (
                  <SubmitBtn
                    className="booking-button"
                    label="Booking options"
                    onClick={() =>
                      navigate(`/book-room/${room._id}`, {
                        state: { checkIn, checkOut, capacity },
                      })
                    }
                  />
                ) : (
                  <p className="loginPrompt">Sign up for a reservation.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="errorText">
            No available rooms found for the selected criteria.
          </p>
        )}

        <Pagination
          postsPerPage={roomsPerPage}
          totalPosts={totalPages * roomsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default AvailableRoomsResults;
