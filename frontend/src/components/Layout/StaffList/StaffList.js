import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ConfirmationModal from "../../UI/Modal/Modal";

const StaffList = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const userString = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
  }

  const options = { headers: { Authorization: "Bearer " + token } };

  async function getUsers() {
    const response = await fetch(
      "http://localhost:5200/api/staff-users",
      options
    );
    const json = await response.json();
    setUsers(json);
  }

  async function deleteUser() {
    if (!selectedUser) return;

    const response = await fetch(
      `http://localhost:5200/api/delete-staff/${selectedUser._id}`,
      {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      }
    );
    const result = await response.json();

    if (result.deletedStaff) {
      setUsers(users.filter((user) => user._id !== selectedUser._id));
    }
    setShowModal(false);
  }

  useEffect(() => {
    getUsers();
    if (userString) {
      const user = JSON.parse(userString);
      setRole(user.role);
    }
  }, []);

  return (
    <>
      <h1>Staff Users</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            {role === "admin" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.surname}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
              {role === "admin" && (
                <td>
                  <>
                    <button>
                      <Link to={`/edit-staff/${user._id}`}>Edit</Link>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmationModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={deleteUser}
        title="Confirm Deletion"
        body={`Are you sure you want to delete ${selectedUser?.name} ${selectedUser?.surname}?`}
        confirmLabel="Delete"
        closeLabel="Cancel"
      />
    </>
  );
};

export default StaffList;
