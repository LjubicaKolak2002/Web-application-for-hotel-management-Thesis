import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../UI/Input/Input";
import SubmitBtn from "../../UI/SubmitBtn/SubmitBtn";
import ErrorMessage from "../../UI/ErrorMessage/ErrorMessage";
import MainLayout from "../MainLayout/MainLayout";
import "./AddRoomType.scss";

const AddRoomType = () => {
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

  function addType(e) {
    e.preventDefault();
    setError("");

    if (!name) {
      setError("Field name is required!");
      return;
    }

    fetch("http://localhost:5200/api/add-roomType", {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        ...options.headers,
      },
    })
      .then((resp) => resp.json())
      .then(() => {
        // TODO - kasnije promijeniti rutu na listu tipova
        navigate("/room-list");
      })
      .catch((err) => console.log(err));
  }
  return (
    <div className="add-room-type-main-container">
      <MainLayout>
        <div className="add-room-type">
          <header className="add-room-type-header">Add room type</header>

          <form onSubmit={addType} className="add-room-type-form">
            <Input
              value={name}
              onChange={onChangeName}
              placeholder="Type name"
              name="name"
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <SubmitBtn label="Add type">Add type</SubmitBtn>
          </form>
        </div>
      </MainLayout>
    </div>
  );
};

export default AddRoomType;
