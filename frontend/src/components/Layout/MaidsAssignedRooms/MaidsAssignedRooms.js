import React, { useState, useEffect } from "react";
import { getTodayDate } from "../../../utils/helper";
import ConfirmationModal from "../../UI/Modal/Modal";
import Textarea from "../../UI/Textarea/Textarea";
import "./MaidsAssignedRooms.scss";

const MaidsAssignedRooms = () => {
  const [maidRooms, setMaidRooms] = useState([]);
  const [role, setRole] = useState("");
  const [editingRoom, setEditingRoom] = useState(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  useEffect(() => {
    if (!token || !userString) {
      setLoading(false);
      return;
    }

    const user = JSON.parse(userString);
    setRole(user.role);

    if (user.role === "maid") {
      getRoomsByMaid(user.id);
    } else {
      setLoading(false);
    }
  }, []);

  async function getRoomsByMaid(maidId) {
    setLoading(true);
    const today = getTodayDate();
    try {
      const result = await fetch(
        `http://192.168.194.66:5200/api/assigned-rooms-by-maid?maidId=${maidId}&date=${today}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      const data = await result.json();
      setMaidRooms(data);
    } catch (error) {
      console.error("Error fetching maid rooms:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateRoomStatus(roomId, note) {
    try {
      const result = await fetch(
        `http://192.168.194.66:5200/api/update-room-status/${roomId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ status: "done", note }),
        }
      );

      if (!result.ok) {
        const data = await result.json();
        setError(data.error || "Error updating room");
      } else {
        setError("");
        const user = JSON.parse(userString);
        await getRoomsByMaid(user.id);
        setEditingRoom(null);
        setNote("");
      }
    } catch (error) {
      console.error(error);
      setError("Network error");
    }
  }

  if (loading) return <p>Loading...</p>;
  if (role !== "maid") return <p>You don't have access.</p>;

  return (
    <div className="maidsAssignedRooms">
      <h2>The rooms assigned for you today</h2>
      {maidRooms.length === 0 ? (
        <p>You have no rooms assigned for today.</p>
      ) : (
        <ul>
          {maidRooms.map((room, index) => (
            <li key={room.roomId}>
              {index + 1}. Room {room.roomNumber}{" "}
              {room.status === "done" ? (
                <span className="done-text">Done</span>
              ) : room.status === "clean" ? (
                <i className="fa solid fa-check-circle done-icon"></i>
              ) : room.status === "occupied" ? (
                <span className="done-text">Check-in done</span>
              ) : (
                <i
                  className="fa-solid fa-pen-to-square edit-icon"
                  onClick={() => {
                    setEditingRoom(room);
                    setNote(room.note || "");
                    setError("");
                  }}
                ></i>
              )}
            </li>
          ))}
        </ul>
      )}

      {editingRoom && (
        <ConfirmationModal
          show={!!editingRoom}
          handleClose={() => setEditingRoom(null)}
          handleConfirm={() => updateRoomStatus(editingRoom.roomId, note)}
          title={editingRoom.roomNumber}
          confirmLabel="Done"
          error={error}
          body={
            <>
              <p>Set status to "done" and optionally add a note:</p>
              <Textarea
                name="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter a note"
                rows={4}
              />
            </>
          }
        />
      )}
    </div>
  );
};

export default MaidsAssignedRooms;
