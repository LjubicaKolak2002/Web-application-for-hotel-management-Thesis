import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ConfirmationModal from "../../UI/Modal/Modal";
import "./EventList.css";
import Select from "../../UI/Select/Select";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [role, setRole] = useState("");
  const [eventFilter, setEventFilter] = useState("All");

  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
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
    setFilteredEvents(json);
  }

  async function deleteEvent() {
    if (!selectedEvent) return;

    const response = await fetch(
      `http://localhost:5200/api/remove-event/${selectedEvent._id}`,
      {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      }
    );
    const result = await response.json();

    if (result.deletedEvent) {
      setEvents(events.filter((event) => event._id !== selectedEvent._id));
    }
    setShowModal(false);
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
      const eventDate = new Date(event.datetime);

      if (eventFilter === "All") return true;
      if (eventFilter === "Past") return eventDate < today;
      if (eventFilter === "Current") return eventDate === today;
      if (eventFilter === "Future") return eventDate > today;

      return true;
    });

    setFilteredEvents(filtered);
  }, [eventFilter, events]);

  return (
    <div className="events-container">
      <h1 className="title">Our events</h1>

      {role === "admin" ? (
        <Select
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
      ) : (
        <Select
          name="eventFilter"
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          options={[
            { value: "All", label: "All" },
            { value: "Current", label: "Current Events" },
            { value: "Future", label: "Future Events" },
          ]}
        />
      )}
      <br />
      <br />

      {events.length === 0 ? (
        <p className="no-events">No events available.</p>
      ) : (
        <div className="event-grid">
          {filteredEvents.map((event) => (
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
                  <strong>Date & Time:</strong>{" "}
                  {new Date(event.datetime).toLocaleString()}
                </p>
                <p className="event-meta">
                  <strong>Capacity:</strong> {event.capacity}
                </p>
                <p className="event-meta">
                  <strong>Available Spots:</strong>{" "}
                  {event.availableSpots || "N/A"}
                </p>
                {role === "admin" && (
                  <button
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowModal(true);
                    }}
                  >
                    Remove
                  </button>
                )}
                <p>
                  <Link to={`/events/${event._id}`}>
                    <button>View more</button>
                  </Link>
                </p>
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
        body={`Are you sure you want to delete this event: ${selectedEvent?.name}`}
        confirmLabel="Delete"
        closeLabel="Cancel"
      />
    </div>
  );
};

export default EventList;
