import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SubmitBtn from "../../UI/SubmitBtn/SubmitBtn";
import ErrorMessage from "../../UI/ErrorMessage/ErrorMessage";

const UnblockRoom = () => {
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
      "Content-Type": "application/json;charset=UTF-8",
    },
  };

  async function handleUnblock(e) {
    e.preventDefault();
    setError("");

    fetch(`http://localhost:5200/api/unblock-room/${params.room_id}`, {
      method: "PUT",
      headers: options.headers,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          navigate("/room-list");
        } else {
          setError("Error unblocking room");
        }
      })
      .catch(() => setError("Something went wrong"));
  }

  return (
    <form onSubmit={handleUnblock}>
      <h2>Unblock room</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <SubmitBtn label="Unblock" />
    </form>
  );
};

export default UnblockRoom;
