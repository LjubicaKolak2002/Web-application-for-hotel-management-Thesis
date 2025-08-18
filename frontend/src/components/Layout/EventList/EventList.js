import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ConfirmationModal from "../../UI/Modal/Modal";
import Button from "../../UI/Button/Button";
import Select from "../../UI/Select/Select";
import "./EventList.scss";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [role, setRole] = useState("");
  const initialRole = JSON.parse(localStorage.getItem("user"))?.role;
  const [eventFilter, setEventFilter] = useState(
    initialRole === "admin" ? "All" : "Current"
  );

  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  async function getEvents() {
    try {
      const response = await fetch("http://localhost:5200/api/events-list");
      const json = await response.json();
      setEvents(json);
    } catch (err) {
      console.error("Fetch events error:", err);
    }
  }

  async function deleteEvent() {
    if (!selectedEvent) return;
    try {
      const response = await fetch(
        `http://localhost:5200/api/remove-event/${selectedEvent._id}`,
        {
          method: "DELETE",
          headers: { Authorization: "Bearer " + token },
        }
      );
      const result = await response.json();
      if (result.deletedEvent) {
        setEvents((prev) => prev.filter((e) => e._id !== selectedEvent._id));
      }
      setShowModal(false);
    } catch (err) {
      console.error("Delete event error:", err);
      setShowModal(false);
    }
  }

  useEffect(() => {
    getEvents();
    if (userString) {
      const user = JSON.parse(userString);
      setRole(user.role);
    }
  }, []);

  useEffect(() => {
    const today = new Date();
    const filtered = events.filter((event) => {
      const evDate = new Date(event.datetime);
      if (eventFilter === "All") return true;
      if (eventFilter === "Past") return evDate < today;
      if (eventFilter === "Current")
        return evDate.toDateString() === today.toDateString();
      if (eventFilter === "Future") return evDate > today;
      return true;
    });
    setFilteredEvents(filtered);
  }, [eventFilter, events]);

  return (
    <div
      className={`events-container ${
        role === "admin" ? "admin-events-container" : ""
      }`}
    >
      <div
        className={`events-header ${
          role === "admin" ? "admin-events-header" : ""
        }`}
      >
        <h1
          className={`events-title ${
            role === "admin" ? "admin-events-title" : ""
          }`}
        >
          Our Events
        </h1>
        <div className="select-wrapper">
          {role === "admin" ? (
            <>
              <Select
                className="select-events"
                name="eventFilter"
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                options={[
                  { value: "All", label: "All" },
                  { value: "Past", label: "Past Events" },
                  { value: "Current", label: "Current Events" },
                  { value: "Future", label: "Future Events" },
                ]}
              />
              <Link to="/add-event">
                <Button variant="add" label="+ Add" className="add-event-btn" />
              </Link>
            </>
          ) : (
            <Select
              name="eventFilter"
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              options={[
                { value: "Current", label: "Current Events" },
                { value: "Future", label: "Future Events" },
              ]}
            />
          )}
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <p className="no-events">No events available.</p>
      ) : (
        <div className="event-grid">
          {filteredEvents.map((event) => (
            <div key={event._id} className="event-card">
              {event.image ? (
                <div
                  className="card-image"
                  style={{ backgroundImage: `url(${event.image})` }}
                ></div>
              ) : (
                <div className="card-image no-image">
                  <i className="fa-solid fa-image"></i>
                  <span>No image available</span>
                </div>
              )}

              <div className="card-overlay"></div>

              <div className="card-content">
                <h2 className="card-title">{event.name}</h2>
                <p className="card-date">
                  {new Date(event.datetime).toLocaleDateString()} &bull;{" "}
                  {new Date(event.datetime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="card-info">
                  <strong>Capacity:</strong> {event.capacity} |{" "}
                  <strong>Available:</strong> {event.availableSpots || "N/A"}
                </p>

                <div className="card-buttons">
                  {role === "admin" && (
                    <Button
                      variant="red"
                      className="btn-delete"
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowModal(true);
                      }}
                      label={<i className="fa-solid fa-trash"></i>}
                    />
                  )}

                  <Link to={`/events/${event._id}`} className="btn-view">
                    View More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmationModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={deleteEvent}
        title="Confirm Deletion"
        body={`Are you sure you want to delete this event: ${selectedEvent?.name}?`}
        confirmLabel="Delete"
        closeLabel="Cancel"
      />
    </div>
  );
};

export default EventList;
