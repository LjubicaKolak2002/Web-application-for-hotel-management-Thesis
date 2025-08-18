import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { formatDateTime } from "../../../utils/helper";
import Button from "../../UI/Button/Button";
import "./EventDetails.scss";
const EventDetails = () => {
  const [data, setData] = useState({
    name: "",
    image: "",
    description: "",
    organizer: "",
    datetime: [],
    location: "",
    capacity: "",
    availableSpots: "",
  });
  const [role, setRole] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const params = useParams();
  const token = localStorage.getItem("token");

  const userString = localStorage.getItem("user");
  const user = JSON.parse(userString);
  const userId = user?.id;

  async function getEvent() {
    const response = await fetch(
      `http://localhost:5200/api/events/${params.event_id}`
    );
    console.log("response:", response);
    const eventData = await response.json();
    setData(eventData);
  }

  async function eventRegistration() {
    try {
      const response = await fetch(
        `http://localhost:5200/api/event-register/${params.event_id}`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setIsRegistered(true);
        setData((prevData) => ({
          ...prevData,
          availableSpots: Math.max(prevData.availableSpots - 1, 0),
        }));
      } else {
        alert(result.message || "Failed to register");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function checkRegistration() {
    const response = await fetch(
      `http://localhost:5200/api/check-registration/${params.event_id}/${userId}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const result = await response.json();
    setIsRegistered(result.registered);
  }

  useEffect(() => {
    getEvent();
    checkRegistration();
    if (userString) {
      const user = JSON.parse(userString);
      setRole(user.role);
    }
  }, []);

  return (
    <div
      className={`event-container ${
        role === "admin" ? "admin-event-container" : ""
      }`}
    >
      <div
        className={`event-left ${role === "admin" ? "admin-event-left" : ""}`}
      >
        <h1 className="event-title">{data.name}</h1>
        {data.image && (
          <img src={data.image} alt={data.name} className="event-image" />
        )}
      </div>

      <div
        className={`event-right ${role === "admin" ? "admin-event-right" : ""}`}
      >
        <p className="event-description">{data.description}</p>
        <p className="event-meta">
          <strong>Organizer:</strong> {data.organizer}
        </p>

        <p className="event-meta">
          <i className="fa-solid fa-clock"></i> {formatDateTime(data.datetime)}
        </p>
        <p className="event-meta">
          <i className="fa-solid fa-location-dot"></i> {data.location}
        </p>
        <p className="event-meta">
          <i className="fa-solid fa-user-group"></i> {data.capacity}
        </p>
        <p className="event-meta">
          <strong>Available Spots:</strong> {data.availableSpots || "0"}
        </p>

        {isRegistered ? (
          <p className="already-registered">
            You are registered for this event. <br />
            You received a confirmation to your email address with a barcode for
            entry.
          </p>
        ) : user?.role === "user" ? (
          data.availableSpots > 0 ? (
            <Button
              onClick={eventRegistration}
              label="Register"
              variant="add"
            />
          ) : (
            <p className="event-full"> This event is full.</p>
          )
        ) : null}

        {user?.role === "admin" && (
          <p className="event-applications-link">
            <Link
              to={`/users-on-event/${data._id}`}
              state={{ eventName: data.name }}
              className="view-apps-link"
            >
              {/* <i className="fa-solid fa-list"></i> */}
              View applications <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
