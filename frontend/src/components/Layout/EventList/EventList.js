import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./EventList.css";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [role, setRole] = useState("");
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  if (!token) {
    window.location.href = "/login";
  }
  const options = { headers: { Authorization: "Bearer " + token } };

  async function getEvents() {
    const response = await fetch(
      "http://localhost:5200/api/events-list",
      options
    );
    const json = await response.json();
    setEvents(json);
  }

  useEffect(() => {
    getEvents();
    if (userString) {
      const user = JSON.parse(userString);
      setRole(user.role);
    }
  }, []);

  return (
    <div className="events-container">
      <h1 className="title">Upcoming Events</h1>
      {events.length === 0 ? (
        <p className="no-events">No events available.</p>
      ) : (
        <div className="event-grid">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              {event.image && (
                <div className="event-image">
                  <img
                    src={event.image}
                    alt={event.name}
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}

              <div className="event-info">
                <h2>{event.name}</h2>
                <p className="event-meta">
                  <strong>Organizer:</strong> {event.organizer}
                </p>
                <p className="event-description">
                  {event.description || "No description provided"}
                </p>
                <p className="event-meta">
                  <strong>Date & Time:</strong>{" "}
                  {new Date(event.datetime).toLocaleString()}
                </p>
                <p className="event-meta">
                  <strong>Location:</strong> {event.location}
                </p>
                <p className="event-meta">
                  <strong>Capacity:</strong> {event.capacity}
                </p>
                <p className="event-meta">
                  <strong>Available Spots:</strong>{" "}
                  {event.availableSpots || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
