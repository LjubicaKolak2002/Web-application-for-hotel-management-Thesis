import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../UI/Input/Input";
import SubmitBtn from "../../UI/SubmitBtn/SubmitBtn";
import Textarea from "../../UI/Textarea/Textarea";
import ErrorMessage from "../../UI/ErrorMessage/ErrorMessage";

const AddRoomCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
  }

  const options = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function addCategory(e) {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.description) {
      setError("All fields are required!");
      return;
    }

    fetch("http://localhost:5200/api/add-roomCategory", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        ...options.headers,
      },
    })
      .then((resp) => resp.json())
      .then(() => {
        navigate("/room-categories-list");
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="outer">
      <div className="form">
        <div className="form-body">
          <header>Add Room Category</header>
          <br />

          <form onSubmit={addCategory}>
            <Input
              name="name"
              value={formData.name}
              placeholder="Name"
              onChange={handleChange}
            />
            <br />

            <Textarea
              name="description"
              value={formData.description}
              placeholder="Description"
              onChange={handleChange}
            />
            <br />

            <br />
            <SubmitBtn label="Add category" />

            <ErrorMessage message={error} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRoomCategory;
