import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ConfirmationModal from "../../UI/Modal/Modal";
import UnblockRoom from "../UnblockRoom/UnblockRoom";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [role, setRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const userString = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
  }

  const options = { headers: { Authorization: "Bearer " + token } };

  async function getRooms() {
    const response = await fetch(
      "http://localhost:5200/api/room-list",
      options
    );
    const json = await response.json();
    setRooms(json);
  }

  async function deleteRoom() {
    if (!selectedRoom) return;

    const response = await fetch(
      `http://localhost:5200/api/delete-room/${selectedRoom._id}`,
      {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      }
    );
    const result = await response.json();

    if (result.deletedRoom) {
      setRooms(rooms.filter((room) => room._id !== selectedRoom._id));
    }
    setShowModal(false);
  }

  useEffect(() => {
    getRooms();
    if (userString) {
      const user = JSON.parse(userString);
      setRole(user.role);
    }
  }, []);

  return (
    <>
      <h1>All Rooms</h1>
      <table>
        <thead>
          <tr>
            <th>Number</th>
            <th>Capacity</th>
            <th>Category</th>
            <th>Features</th>
            <th>Price</th>
            {role === "admin" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room._id}>
              <td>{room.number}</td>
              <td>{room.capacity}</td>
              <td>{room.category.name}</td>
              <td>{room.features.map((f) => f.name).join(", ")}</td>
              <td>{room.price} €</td>

              {/*TODO  admina editiranje*/}
              {role === "admin" && (
                <td>
                  <>
                    {/* <button>
                      <Link to={`/edit-staff/${user._id}`}>Edit</Link>
                    </button> */}
                    <button
                      onClick={() => {
                        setSelectedRoom(room);
                        setShowModal(true);
                      }}
                    >
                      Delete
                    </button>
                    {room.blocked ? (
                      <Link to={`/unblock-room/${room._id}`}>
                        <button>Unblock room</button>
                      </Link>
                    ) : (
                      <Link to={`/block-room/${room._id}`}>
                        <button>Block Room</button>
                      </Link>
                    )}
                  </>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmationModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={deleteRoom}
        title="Confirm Deletion"
        body={`Are you sure you want to delete room number: ${selectedRoom?.number}`}
        confirmLabel="Delete"
        closeLabel="Cancel"
      />
    </>
  );
};

export default RoomList;
