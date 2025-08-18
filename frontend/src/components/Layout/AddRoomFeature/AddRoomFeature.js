import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../UI/Input/Input";
import SubmitBtn from "../../UI/SubmitBtn/SubmitBtn";
import ErrorMessage from "../../UI/ErrorMessage/ErrorMessage";
import MainLayout from "../MainLayout/MainLayout";
import "./AddRoomFeature.scss";

const AddRoomFeature = () => {
  const [name, setName] = useState("");
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

  function onChangeName(e) {
    setName(e.target.value);
  }

  function addFeature(e) {
    e.preventDefault();
    setError("");

    if (!name) {
      setError("Field name is required!");
      return;
    }

    fetch("http://localhost:5200/api/add-roomFeature", {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        ...options.headers,
      },
    })
      .then((resp) => resp.json())
      .then(() => {
        // TO DO - kasnije promijeniti rutu
        navigate("/room-list");
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="add-room-feature-main-container">
      <MainLayout>
        <div className="add-room-feature">
          <header className="add-room-feature-header">Add room feature</header>

          <form onSubmit={addFeature} className="add-room-feature-form">
            <Input
              value={name}
              onChange={onChangeName}
              placeholder="Feature name"
              name="name"
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <SubmitBtn label="Add feature">Add Feature</SubmitBtn>
          </form>
        </div>
      </MainLayout>
    </div>
  );
};

export default AddRoomFeature;
