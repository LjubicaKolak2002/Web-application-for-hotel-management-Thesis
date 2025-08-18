import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ConfirmationModal from "../../UI/Modal/Modal";
import Select from "../../UI/Select/Select";
import Pagination from "../../UI/Pagination/Pagination";
import Button from "../../UI/Button/Button";
import "./StaffList.scss";

const StaffList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [roleFilter, setRoleFilter] = useState("All");
  const [role, setRole] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [usersPerPage] = useState(8);

  const indexOfLastUser = currentPage * usersPerPage;

  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const paginatedUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

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
    setCurrentPage(1); // reset paging
    if (roleFilter === "All") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter((u) => u.role === roleFilter));
    }
  }, [roleFilter, users]);

  return (
    <div className="staff-list">
      <h1>Hotel staff</h1>
      <div className="staff-list-filter-options">
        <Select
          className="staff-list-select"
          name="roleFilter"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          options={roles.map((r) => ({
            value: r,
            label: r,
          }))}
          placeholder="Filter by Role"
        />

        <Link to="/add-staff">
          <Button variant="add">
            <i
              className="fa-solid fa-user-plus"
              style={{ marginRight: "6px" }}
            ></i>
            Add
          </Button>
        </Link>
      </div>

      <div className="staff-table-wrapper">
        <table className="staff-table">
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
            {paginatedUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.surname}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                {role === "admin" && (
                  <td>
                    <div className="staff-list-btns">
                      <Link to={`/edit-staff/${user._id}`}>
                        <i className="fa-solid fa-user-pen"></i>
                      </Link>

                      <Button
                        variant="red"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowModal(true);
                        }}
                        label={<i className="fa-solid fa-trash" />}
                      />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="staff-list-pagination-wrapper">
        <Pagination
          postsPerPage={usersPerPage}
          totalPosts={filteredUsers.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>

      <ConfirmationModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={deleteUser}
        title="Confirm Deletion"
        body={`Are you sure you want to delete ${selectedUser?.name} ${selectedUser?.surname}?`}
        confirmLabel="Delete"
        closeLabel="Cancel"
      />
    </div>
  );
};

export default StaffList;
