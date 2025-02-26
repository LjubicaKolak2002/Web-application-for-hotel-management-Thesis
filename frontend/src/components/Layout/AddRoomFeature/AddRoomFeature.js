import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../UI/Input/Input";
import SubmitBtn from "../../UI/SubmitBtn/SubmitBtn";
import ErrorMessage from "../../UI/ErrorMessage/ErrorMessage";
import "./AddRoomFeature.css";

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
        // TODO - kasnije promijeniti rutu
        navigate("/");
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <form onSubmit={addFeature}>
        <h2>Add Room Feature</h2>
        <Input
          value={name}
          onChange={onChangeName}
          placeholder="Feature name"
          name="name"
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <SubmitBtn label="Add feature">Add Feature</SubmitBtn>
      </form>
    </>
  );
};

export default AddRoomFeature;
