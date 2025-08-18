import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Textarea from "../../UI/Textarea/Textarea";
import SubmitBtn from "../../UI/SubmitBtn/SubmitBtn";
import ErrorMessage from "../../UI/ErrorMessage/ErrorMessage";
import MainLayout from "../MainLayout/MainLayout";
import "./BlockRoom.scss";

const BlockRoom = () => {
  const [blockReason, setBlockReason] = useState("");
  const [error, setError] = useState("");
  const [room, setRoom] = useState("");
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

    if (!blockReason) {
      setError("Block reason is required.");
      return;
    }

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

  async function getRoom() {
    const response = await fetch(
      `http://localhost:5200/api/room/${params.room_id}`,
      options
    );
    if (!response.ok) {
      setError("Error");
      return;
    }
    const roomResult = await response.json();
    setRoom(roomResult.number);
  }

  useEffect(() => {
    getRoom();
  }, []);
  return (
    <div className="block-room-main-container">
      <MainLayout>
        <div className="block-room">
          <header className="block-room-header">Block room {room}</header>
          <form onSubmit={handleBlock} className="block-room-form">
            <Textarea
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="Enter block reason"
              name="blockReason"
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <SubmitBtn label="Block" />
          </form>
        </div>
      </MainLayout>
    </div>
  );
};

export default BlockRoom;
