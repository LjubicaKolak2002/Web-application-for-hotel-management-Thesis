import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../UI/Input/Input";
import SubmitBtn from "../../UI/SubmitBtn/SubmitBtn";
import Textarea from "../../UI/Textarea/Textarea";
import ErrorMessage from "../../UI/ErrorMessage/ErrorMessage";
import MainLayout from "../MainLayout/MainLayout";
import "./AddRoomCategory.scss";

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
    <div className="add-room-category-main-container">
      <MainLayout>
        <div className="add-room-category">
          <header className="add-room-category-header">
            Add Room Category
          </header>
          <form onSubmit={addCategory} className="add-room-category-form">
            <Input
              name="name"
              value={formData.name}
              placeholder="Name"
              onChange={handleChange}
            />

            <Textarea
              name="description"
              value={formData.description}
              placeholder="Description"
              onChange={handleChange}
            />
            <ErrorMessage message={error} />
            <SubmitBtn label="Add category" />
          </form>
        </div>
      </MainLayout>
    </div>
  );
};

export default AddRoomCategory;
