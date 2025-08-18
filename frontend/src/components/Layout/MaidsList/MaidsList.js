import React, { useState, useEffect } from "react";
import ConfirmationModal from "../../UI/Modal/Modal";
import Button from "../../UI/Button/Button";
import { getTodayDate } from "../../../utils/helper";
import Textarea from "../../UI/Textarea/Textarea";
import "./MaidsList.scss";

const MaidsList = () => {
  const [maids, setMaids] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedMaid, setSelectedMaid] = useState(null);
  const [assignedRooms, setAssignedRooms] = useState([]);
  const [maidRooms, setMaidRooms] = useState({});
  const [editingRoom, setEditingRoom] = useState(null);
  const [note, setNote] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  if (!token) window.location.href = "/login";
  const options = { headers: { Authorization: "Bearer " + token } };

  async function getMaids() {
    const res = await fetch("http://localhost:5200/api/maids", options);
    const data = await res.json();
    setMaids(data);
  }

  async function getCheckOutRooms() {
    const today = getTodayDate();
    const res = await fetch(
      `http://localhost:5200/api/arrivals-departures?date=${today}`,
      options
    );
    const data = await res.json();
    setRooms(data.checkOuts || []);
  }

  async function assignRoom(roomId) {
    setError("");
    const maidId = selectedMaid?._id;
    const date = new Date().toISOString().split("T")[0];
    if (!maidId || !roomId || !date) {
      setError("Missing data");
      return;
    }

    try {
      const res = await fetch("http://localhost:5200/api/assign-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ maidId, roomId, date }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        setAssignedRooms((prev) => [...prev, roomId]);
      }
    } catch {
      setError("Network error");
    }
  }

  //sve zadane sobe za taj dan
  async function getAssignedRooms(date) {
    const res = await fetch(
      `http://localhost:5200/api/assigned-rooms?date=${date}`,
      options
    );
    const data = await res.json();
    if (res.ok) {
      setAssignedRooms(data.map((task) => task.room));
    } else {
      setAssignedRooms([]);
    }
  }

  //otvori modal za dodjelu soba
  async function handleAssignClick(maid) {
    setSelectedMaid(maid);
    const today = new Date().toISOString().split("T")[0];
    await getCheckOutRooms();
    await getAssignedRooms(today);
    setShowModal(true);
  }

  async function getRoomsByMaid(maidId) {
    const today = getTodayDate();
    try {
      const res = await fetch(
        `http://localhost:5200/api/assigned-rooms-by-maid?maidId=${maidId}&date=${today}`,
        options
      );
      const data = await res.json();
      setMaidRooms((prev) => ({ ...prev, [maidId]: data }));
    } catch {
      console.log("Error fetching rooms by maid");
    }
  }

  //refresg
  async function refreshMaidRooms() {
    maids.forEach((m) => getRoomsByMaid(m._id));
  }

  function handleCloseModal() {
    setShowModal(false);
    refreshMaidRooms();
  }

  async function updateRoom(roomId, newStatus, note) {
    try {
      const res = await fetch(
        `http://localhost:5200/api/update-room-status/${roomId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus, note }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error updating room");
      } else {
        setError("");
        setEditingRoom(null);
        setNote("");
        refreshMaidRooms();
      }
    } catch {
      setError("Network error");
    }
  }

  useEffect(() => {
    getMaids();
  }, []);

  useEffect(() => {
    maids.forEach((m) => getRoomsByMaid(m._id));
  }, [maids]);

  return (
    <div className="maidsContainer">
      <h3 className="maidsTitle">Housekeeping Team</h3>

      {maids.length > 0 ? (
        <div className="maidsList">
          {maids.map((maid) => (
            <div key={maid._id} className="maidCard">
              <div className="maidHeader">
                <span className="maidName">
                  {maid.name} {maid.surname}
                </span>
                <Button
                  label="+ Assign"
                  onClick={() => handleAssignClick(maid)}
                  className="assignButton"
                />
              </div>
              <div className="roomButtonsContainer">
                {maidRooms[maid._id] && maidRooms[maid._id].length > 0 ? (
                  maidRooms[maid._id].map((room) => (
                    <button
                      key={room.roomId}
                      className={`roomTag ${
                        room.status === "done"
                          ? "done"
                          : room.status === "clean" ||
                            room.status === "occupied"
                          ? "clean"
                          : "dirty"
                      }`}
                      onClick={() => {
                        if (
                          room.status !== "clean" &&
                          room.status !== "occupied"
                        ) {
                          setEditingRoom(room);
                          setNote(room?.note ?? "");
                        }
                      }}
                    >
                      <i
                        className={`fa-solid ${
                          room.status === "occupied"
                            ? "fa-bed"
                            : room.status === "clean"
                            ? "fa-check-circle"
                            : "fa-circle-notch"
                        }`}
                      ></i>
                      Room {room.roomNumber}
                    </button>
                  ))
                ) : (
                  <p className="noRooms">No rooms assigned today.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="noMaids">There are no housekeepers.</p>
      )}

      <ConfirmationModal
        show={showModal}
        handleClose={handleCloseModal}
        title={`Assign rooms to ${selectedMaid?.name}`}
        error={error}
        dialogClassName="maids-modal"
        body={
          <div className="modalRoomList">
            {rooms.length === 0 ? (
              <p className="noCheckoutRooms">No checkout rooms today.</p>
            ) : (
              rooms
                .filter((room) => room && room.room) // izbaci null/invalid
                .map((room) => {
                  const isAssigned = assignedRooms.includes(
                    room.room._id?.toString()
                  );
                  const isDirty = room.room.status === "dirty";
                  const isDisabled = !isDirty || isAssigned;

                  return (
                    <Button
                      key={room._id}
                      label={`Room ${room.room.number}`}
                      onClick={() => {
                        if (isDirty && !isAssigned) assignRoom(room.room._id);
                      }}
                      disabled={isDisabled}
                      variant="maids"
                      className={`roomButton ${
                        isAssigned
                          ? "assigned"
                          : isDirty
                          ? "available"
                          : "unavailable"
                      }`}
                    />
                  );
                })
            )}
          </div>
        }
      />

      {editingRoom && (
        <ConfirmationModal
          show={!!editingRoom}
          handleClose={() => setEditingRoom(null)}
          handleConfirm={() => updateRoom(editingRoom.roomId, "clean", note)}
          title={`Room ${editingRoom.roomNumber} Status`}
          confirmLabel="Confirm"
          error={error}
          body={
            <>
              {editingRoom.note && (
                <div className="currentNote">
                  <strong>Note:</strong>
                  <p>{editingRoom.note}</p>
                </div>
              )}
              <p>Edit or remove note before confirming clean status:</p>
              <Textarea
                name="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter a note (optional)"
                rows={4}
              />
              <Button
                label="Remove note"
                onClick={() => setNote("")}
                variant="delete"
                className="remove-note-btn"
              />
            </>
          }
        />
      )}
    </div>
  );
};

export default MaidsList;
