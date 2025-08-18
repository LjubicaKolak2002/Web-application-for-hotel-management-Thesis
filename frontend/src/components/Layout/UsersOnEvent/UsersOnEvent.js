import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./UsersOnEvent.scss";

const UsersOnEvent = () => {
  const [users, setUsers] = useState([]);
  const location = useLocation();

  const eventName = location.state?.eventName;
  console.log("state", location.state);

  const token = localStorage.getItem("token");
  const params = useParams();
  console.log("PARAMS:", params);

  if (!token) {
    window.location.href = "/login";
  }

  const options = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  async function getUsers() {
    const response = await fetch(
      `http://localhost:5200/api/users-on-event/${params.event_id}`,
      options
    );
    const result = await response.json();
    console.log("RESULT:", result);
    setUsers(result);
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="users-on-event-container">
      <h3 className="users-on-event-header">Users on event - {eventName}</h3>
      <div className="users-on-event-table-wrapper">
        <table className="users-on-event-table">
          <thead>
            <th>#</th>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Country</th>
          </thead>
          <tbody>
            {users.length > 0 &&
              users.map((user, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{user.name}</td> <td>{user.surname}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  {user.country?.name && (
                    <td>
                      <img
                        src={`https://flagcdn.com/24x18/${user.country?.code.toLowerCase()}.png`}
                        alt={user.country?.name}
                        width="24"
                        height="18"
                        style={{ marginRight: "8px" }}
                      />
                      ({user.country?.name})
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersOnEvent;
