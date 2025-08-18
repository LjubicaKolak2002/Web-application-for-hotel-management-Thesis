import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../pictures/logo5.png";
import "./Navbar.scss";

const Navbar = ({ userName, role, id }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [reservationsOpen, setReservationsOpen] = useState(false);
  const [dropdownWidth, setDropdownWidth] = useState(null);
  const reservationsToggleRef = useRef(null);

  //da se drugi zatvori kad se jedan otvori
  const toggleReservations = () => {
    setDropdownOpen(false);
    setReservationsOpen((prev) => !prev);
  };
  const toggleDropdown = () => {
    setReservationsOpen(false);
    setDropdownOpen((prev) => !prev);
  };
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const showMobileMenu =
    menuOpen && (role === "maid" || !role || role === "user");

  useEffect(() => {
    if (reservationsOpen && reservationsToggleRef.current) {
      const width = reservationsToggleRef.current.offsetWidth;
      setDropdownWidth(width);
    }
  }, [reservationsOpen]);

  return (
    <nav className={`navbar ${role === "maid" ? "maid" : ""}`}>
      <div className="navbar_container">
        <div className="navbar_left">
          <div className="navbar_logo">
            <img src={logo} alt="Hotelio logo" />
            <span className="navbar__title">HOTELIO</span>
          </div>
        </div>

        {(role === "maid" || !role || role === "user") && (
          <div className="hamburger-icon" onClick={toggleMenu}>
            <i className="fa-solid fa-bars"></i>
          </div>
        )}

        {role !== "maid" && (
          <div className="navbar_center">
            <ul className="navbar_links">
              {role === "admin" && (
                <>
                  <li>
                    <Link to="search-rooms-by-date">Booking</Link>
                  </li>
                  <li>
                    <Link to="room-list">Rooms</Link>
                  </li>
                  <li>
                    <Link to="room-categories-list">Categories</Link>
                  </li>
                  <li>
                    <Link to="events-list">Events</Link>
                  </li>
                  <li>
                    <Link to="reviews">Reviews</Link>
                  </li>
                  <li>
                    <Link to="/statistics">Statistics</Link>
                  </li>
                  <li>
                    <Link to="/staff-list">Staff</Link>
                  </li>
                  <li>
                    <Link to="arrivals-departures">Reservations</Link>
                  </li>
                </>
              )}
              {role === "receptionist" && (
                <>
                  <li>
                    <Link to="room-list">Rooms</Link>
                  </li>
                  <li>
                    <Link to="arrivals-departures">Arrivals - Departures</Link>
                  </li>
                </>
              )}
              {role === "head maid" && (
                <>
                  <li>
                    <Link to="maids-checkList">Departures</Link>
                  </li>
                  <li>
                    <Link to="maids-list">Housekeeping</Link>
                  </li>
                </>
              )}
              {(role === "user" || !role) && (
                <>
                  <li>
                    <Link to="search-rooms-by-date">Explore rooms</Link>
                  </li>
                  <li>
                    <Link to="room-categories-list">Categories</Link>
                  </li>
                  <li>
                    <Link to="events-list">Events</Link>
                  </li>
                  <li>
                    <Link to="reviews">Reviews</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}

        <div className="navbar_right">
          <ul>
            {role === "user" && (
              <li className="dropdown reservations-dropdown">
                <span
                  ref={reservationsToggleRef}
                  className={`dropdown-toggle ${
                    reservationsOpen ? "open" : ""
                  }`}
                  onClick={toggleReservations}
                >
                  Reservations
                </span>
                {reservationsOpen && (
                  <ul
                    className="dropdown-menu reservations-menu"
                    style={{ width: dropdownWidth }}
                  >
                    <li>
                      <Link
                        to={`/my-future-reservations/${id}`}
                        onClick={() => setReservationsOpen(false)}
                      >
                        Future reservations
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`/my-past-reservations/${id}`}
                        onClick={() => setReservationsOpen(false)}
                      >
                        Past reservations
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            )}

            {userName ? (
              <li className="dropdown user-dropdown">
                <span
                  className={`dropdown-toggle ${dropdownOpen ? "open" : ""}`}
                  onClick={toggleDropdown}
                >
                  <i className="fa-solid fa-user-circle"></i> {userName}
                </span>
                {dropdownOpen && (
                  <ul className="dropdown-menu user-menu">
                    <li>
                      <Link to="/logout" className="logout">
                        <i className="fa-solid fa-right-from-bracket"></i>{" "}
                        Logout
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            ) : (
              <>
                <li className="login-li">
                  <Link to="/login">Log in</Link>
                </li>
                <li className="register-li">
                  <Link to="/register">Sign up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* hamburger  */}
      {showMobileMenu && (
        <div className="mobile-menu">
          <ul>
            {!userName && (
              <>
                <li>
                  <Link to="/login" onClick={() => setMenuOpen(false)}>
                    Log in
                  </Link>
                </li>
                <li>
                  <Link to="/register" onClick={() => setMenuOpen(false)}>
                    Sign up
                  </Link>
                </li>
              </>
            )}
            {role === "maid" && (
              <li>
                <Link to="/logout" onClick={() => setMenuOpen(false)}>
                  <i className="fa-solid fa-right-from-bracket"></i> Logout
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
