import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Textarea from "../../UI/Textarea/Textarea";
import SubmitBtn from "../../UI/SubmitBtn/SubmitBtn";
import ErrorMessage from "../../UI/ErrorMessage/ErrorMessage";

const BlockRoom = () => {
  const [blockReason, setBlockReason] = useState("");
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

  async function handleBlock(e) {
    e.preventDefault();
    setError("");

    fetch(`http://localhost:5200/api/block-room/${params.room_id}`, {
      method: "PUT",
      body: JSON.stringify({ blockReason }),
      headers: options.headers,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          navigate("/room-list");
        } else {
          setError("Error blocking room");
        }
      })
      .catch(() => setError("Something went wrong"));
  }

  return (
    <form onSubmit={handleBlock}>
      <h2>Block Room</h2>
      <Textarea
        value={blockReason}
        onChange={(e) => setBlockReason(e.target.value)}
        placeholder="Enter block reason"
        name="blockReason"
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <SubmitBtn label="Block" />
    </form>
  );
};

export default BlockRoom;
