import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ConfirmationModal from "../../UI/Modal/Modal";
import Select from "../../UI/Select/Select";

const StaffList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [roleFilter, setRoleFilter] = useState("All");
  const [role, setRole] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
    setFilteredUsers(json);
  }

  async function getRoles() {
    const response = await fetch(
      "http://localhost:5200/api/staff-user-roles",
      options
    );
    const json = await response.json();
    setRoles(["All", ...json]); //all za sve
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
      const updatedUsers = users.filter(
        (user) => user._id !== selectedUser._id
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    }
    setShowModal(false);
  }

  useEffect(() => {
    getUsers();
    getRoles();
    if (userString) {
      const user = JSON.parse(userString);
      setRole(user.role);
    }
  }, []);

  useEffect(() => {
    if (roleFilter === "All") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter((user) => user.role === roleFilter));
    }
  }, [roleFilter, users]);

  return (
    <>
      <h1>Staff Users</h1>

      <Select
        name="roleFilter"
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        options={roles.map((r) => ({
          value: r,
          label: r,
        }))}
        placeholder="Filter by Role"
      />

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
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.surname}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
              {role === "admin" && (
                <td>
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
