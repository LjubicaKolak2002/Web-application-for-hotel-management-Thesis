import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../UI/Input/Input";
import SubmitBtn from "../../UI/SubmitBtn/SubmitBtn";
import ErrorMessage from "../../UI/ErrorMessage/ErrorMessage";
import Select from "../../UI/Select/Select";
import "./EditStaff.scss";
import MainLayout from "../MainLayout/MainLayout";

const EditStaff = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    phone: "",
    role: "",
  });

  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
  }

  const options = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  async function getRoles() {
    const response = await fetch(
      "http://localhost:5200/api/staff-user-roles",
      options
    );
    const rolesData = await response.json();
    setRoles(rolesData);
  }

  async function getStaff() {
    const response = await fetch(
      `http://localhost:5200/api/staff-details/${params.staff_id}`,
      options
    );
    const staffResult = await response.json();

    setFormData({
      name: staffResult.name,
      surname: staffResult.surname,
      username: staffResult.username,
      email: staffResult.email,
      phone: staffResult.phone,
      role: staffResult.role,
    });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function updateData(e) {
    e.preventDefault();

    if (Object.values(formData).some((val) => val === "")) {
      setError("All fields are required.");
      return;
    }

    fetch(`http://localhost:5200/api/edit-staff/${params.staff_id}`, {
      method: "PUT",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          navigate("/staff-list");
        } else {
          setError("Update error");
        }
      });
  }

  useEffect(() => {
    getStaff();
    getRoles();
  }, []);

  return (
    <div className="edit-staff-main-container">
      <MainLayout offsetTop={40}>
        <div className="edit-staff">
          <header className="edit-staff-header">Edit staff</header>

          <form onSubmit={updateData} className="edit-staff-form">
            <Input
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              name="name"
              iconClass="fa-solid fa-user"
            />
            <ErrorMessage message={error && !formData.name ? error : ""} />

            <Input
              value={formData.surname}
              onChange={handleChange}
              placeholder="Surname"
              name="surname"
              iconClass="fa-solid fa-user"
            />
            <ErrorMessage message={error && !formData.surname ? error : ""} />

            <Input
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              name="username"
              iconClass="fa-solid fa-user"
            />
            <ErrorMessage message={error && !formData.username ? error : ""} />

            <Input
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              name="email"
              iconClass="fa-solid fa-envelope"
            />
            <ErrorMessage message={error && !formData.email ? error : ""} />

            <Input
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              name="phone"
              iconClass="fa-solid fa-phone"
            />
            <ErrorMessage message={error && !formData.phone ? error : ""} />

            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={roles.map((role) => ({ value: role, label: role }))}
              placeholder="Select Role"
            />

            <ErrorMessage message={error && !formData.role ? error : ""} />

            <SubmitBtn label="Save" />
          </form>
        </div>
      </MainLayout>
    </div>
  );
};

export default EditStaff;
