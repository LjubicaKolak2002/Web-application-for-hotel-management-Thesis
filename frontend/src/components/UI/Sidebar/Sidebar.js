import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../pictures/logo5.png";
import "./Sidebar.scss";

const Sidebar = ({ userName, role, id }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      {role === "maid" && (
        <header className="mobile-header">
          <div className="mobile-header__left">
            <img src={logo} alt="Hotel Logo" className="mobile-header__logo" />
            <span className="mobile-header__title">HOTELIO</span>
          </div>
          <div className="mobile-header__hamburger" onClick={toggleMenu}>
            <i className="fa-solid fa-bars"></i>
          </div>
        </header>
      )}

      <div className={`sidebar ${role === "maid" ? "maid-role" : ""}`}>
        <div className="sidebar__logo">
          <img src={logo} alt="Hotel" />
          <span className="sidebar__title">HOTELIO</span>
        </div>

        <div className="sidebar__content">
          <ul className="sidebar__nav">
            {role === "admin" && (
              <>
                <li>
                  <i className="fa-solid fa-bed"></i>{" "}
                  <Link to="/room-list">Rooms</Link>
                </li>
                <li>
                  <i className="fa-solid fa-list"></i>{" "}
                  <Link to="/room-categories-list">Categories</Link>
                </li>
                <li>
                  <i className="fa-solid fa-people-group"></i>{" "}
                  <Link to="/events-list">Events</Link>
                </li>
                <li>
                  <i className="fa-solid fa-star"></i>{" "}
                  <Link to="/admin-reviews">Reviews</Link>
                </li>
                <li>
                  <i className="fa-solid fa-chart-simple"></i>{" "}
                  <Link to="/statistics">Statistics</Link>
                </li>
                <li>
                  <i className="fa-solid fa-user-group"></i>{" "}
                  <Link to="/staff-list">Staff</Link>
                </li>
                <li>
                  <i className="fa-solid fa-clipboard-list"></i>{" "}
                  <Link to="/arrivals-departures">Reservations</Link>
                </li>
              </>
            )}

            {role === "receptionist" && (
              <>
                <li>
                  <i className="fa-solid fa-bed"></i>{" "}
                  <Link to="/room-list">Rooms</Link>
                </li>
                <li>
                  <i className="fa-solid fa-clipboard-list"></i>{" "}
                  <Link to="/arrivals-departures">Arrivals - Departures</Link>
                </li>
              </>
            )}

            {role === "head maid" && (
              <>
                <li>
                  <i className="fa-solid fa-user-group"></i>{" "}
                  <Link to="/maids-table">Maids</Link>
                </li>
                <li>
                  <i className="fas fa-broom"></i>{" "}
                  <Link to="/maids-list">Housekeeping</Link>
                </li>
                <li>
                  <i className="fa-solid fa-clipboard-list"></i>{" "}
                  <Link to="/maids-checkList">Arrivals - Departures</Link>
                </li>
              </>
            )}

            {role === "maid" && (
              <>
                <li>
                  <i className="fas fa-tasks"></i>{" "}
                  <Link to="/maids-assigned-rooms">My tasks</Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="sidebar__footer">
          <Link to="/logout" className="logout">
            <i className="fa-solid fa-user-circle"></i> {userName}
            <i className="fa-solid fa-right-from-bracket"></i>
          </Link>
        </div>
      </div>

      {role === "maid" && isMenuOpen && (
        <div className="sidebar__mobile-menu">
          <ul>
            <li>
              <i className="fas fa-tasks"></i>{" "}
              <Link
                to="/maids-assigned-rooms"
                onClick={() => setIsMenuOpen(false)}
              >
                My tasks
              </Link>
            </li>
            <li>
              <i className="fa-solid fa-right-from-bracket"></i>{" "}
              <Link to="/logout" onClick={() => setIsMenuOpen(false)}>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Sidebar;
