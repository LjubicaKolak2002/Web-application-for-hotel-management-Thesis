import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HomePageTest = () => {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
    }

    if (userString) {
      const user = JSON.parse(userString);
      setUsername(user.name);
      setRole(user.role);
      setUserId(user.id);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {username ? (
        <>
          <h1 className="text-3xl font-bold mb-4">Welcome, {username}!</h1>
          <p className="text-lg mb-6">You are successfully logged in.</p>

          {/* ---------------- User ---------------- */}
          {role === "user" && (
            <>
              <p>
                <Link to={`/my-future-reservations/${userId}`}>
                  My future reservations
                </Link>
              </p>
              <p>
                <Link to={`/my-past-reservations/${userId}`}>
                  My past reservations
                </Link>
              </p>
              <Link to="/logout">Logout</Link>
            </>
          )}

          {/* ---------------- Admin ---------------- */}
          {role === "admin" && (
            <>
              <p>
                <Link to="/add-staff">Add staff</Link>
              </p>
              <p>
                <Link to="/staff-list">Staff list</Link>
              </p>

              <h2>Rooms</h2>
              <p>
                <Link to="/add-room-category">Add room category</Link>
              </p>
              <p>
                <Link to="/add-room-feature">Add room feature</Link>
              </p>
              <p>
                <Link to="/add-room">Add room</Link>
              </p>
              <p>
                <Link to="/room-categories-list">Room categories</Link>
              </p>
              <p>
                <Link to="/room-list">Room list</Link>
              </p>

              <h2>Events</h2>
              <p>
                <Link to="/add-event">Add new event</Link>
              </p>
              <p>
                <Link to="/events-list">Events list</Link>
              </p>

              <h2>Booking</h2>
              <p>
                <Link to="/available-rooms">Available rooms</Link>
              </p>
              <Link to="/logout">Logout</Link>
            </>
          )}

          {/* ---------------- Head Maid ---------------- */}
          {role === "head maid" && (
            <>
              <p>
                <Link to="/maids-list">Maids</Link>
              </p>
              <p>
                <Link to="/maids-checkList">Check list</Link>
              </p>
              <Link to="/logout">Logout</Link>
            </>
          )}

          {role === "maid" && (
            <>
              <p>
                <Link to="/maids-assigned-rooms">My assigned rooms</Link>
              </p>

              <Link to="/logout">Logout</Link>
            </>
          )}

          {role === "receptionist" && (
            <>
              <p>
                <Link to="/arrivals-departures">Arrivals and departures</Link>
              </p>
              <p>
                <Link to="/room-list">Rooms</Link>
              </p>
              <Link to="/logout">Logout</Link>
            </>
          )}
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">
            Welcome to Our Booking System
          </h1>
          <p className="text-lg mb-6">
            Register now to book your perfect stay!
          </p>
          <Link
            to="/register"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Register
          </Link>
          <br />
          <Link
            to="/login"
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Login
          </Link>
        </>
      )}
    </div>
  );
};

export default HomePageTest;
