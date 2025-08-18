import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import clsx from "clsx";
import Button from "../../UI/Button/Button";
import LoadingComponent from "../../UI/Loading/Loading";
import { toast } from "react-toastify";
import "./RoomChange.scss";
import { formatDate } from "../../../utils/helper";

const RoomChange = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [rooms, setRooms] = useState({ matching: [], others: [] });
  const [selectedRoom, setSelectedRoom] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchBookingAndRooms = async () => {
      try {
        setLoading(true);

        const bookingRes = await fetch(
          `http://localhost:5200/api/bookings/${bookingId}`,
          { headers: { Authorization: "Bearer " + token } }
        );
        const bookingData = await bookingRes.json();
        setBooking(bookingData);

        const roomRes = await fetch(
          `http://localhost:5200/api/available-rooms-for-removal?checkIn=${bookingData.checkIn}&checkOut=${bookingData.checkOut}&categoryId=${bookingData.room.category._id}&typeId=${bookingData.room.type._id}&capacity=${bookingData.adults}`,
          { headers: { Authorization: "Bearer " + token } }
        );
        const roomData = await roomRes.json();
        setRooms(roomData);
      } catch {
        toast.error("Error loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingAndRooms();
  }, [bookingId, navigate, token]);

  const handleSubmit = async () => {
    if (!selectedRoom) return toast.warning("Odaberi sobu.");

    try {
      const res = await fetch(
        `http://localhost:5200/api/change-room/${bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ newRoomId: selectedRoom }),
        }
      );
      const data = await res.json();
      navigate("/arrivals-departures");
    } catch {
      toast.error("Greška pri ažuriranju.");
    }
  };

  if (loading || !booking) return <LoadingComponent />;

  const renderGroup = (title, list) => (
    <fieldset className="rc-group">
      <legend className="rc-group__title">{title}</legend>

      {list.length === 0 && <p className="rc-empty">No rooms available.</p>}

      {list.map((room) => (
        <label
          key={room._id}
          className={clsx(
            "rc-row",
            selectedRoom === room._id && "rc-row--selected"
          )}
        >
          <input
            type="radio"
            name="room"
            value={room._id}
            checked={selectedRoom === room._id}
            onChange={() => setSelectedRoom(room._id)}
            className="rc-radio"
          />

          <span className="rc-dot" />

          <span className="rc-col rc-col--number">Room&nbsp;{room.number}</span>
          <span className="rc-col rc-col--type">{room.type.name}</span>
          <span className="rc-col rc-col--cat">{room.category.name}</span>

          <span className="rc-col rc-col--cap">
            {room.capacity} {room.capacity === 1 ? "adult" : "adults"}
          </span>
        </label>
      ))}
    </fieldset>
  );

  return (
    <div className="room-change">
      <div className="rc-container">
        <h2 className="room-change__title">Change room on reservation</h2>
        <div className="room-change__booking-info">
          <div className="room-change__row">
            <span>
              Guest:{" "}
              <strong>
                {booking.user?.name} {booking.user?.surname}
              </strong>
            </span>
            <span className="room-change__room">
              Current room: <strong>{booking.room?.number}</strong>
            </span>
          </div>

          <div className="room-change__row">
            <span>
              Check-in: <strong>{formatDate(booking.checkIn)}</strong>
            </span>
            <span className="room-change__room">
              Check-out: <strong>{formatDate(booking.checkOut)}</strong>
            </span>
          </div>
        </div>

        {renderGroup(
          "Available rooms with the same characteristics",
          rooms.matching
        )}
        {renderGroup("Other available rooms", rooms.others)}

        <Button
          onClick={handleSubmit}
          label="Confirm"
          className="room-change__btn"
          variant="optional"
        />
      </div>
    </div>
  );
};

export default RoomChange;
