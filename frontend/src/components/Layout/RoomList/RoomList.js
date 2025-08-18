import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ConfirmationModal from "../../UI/Modal/Modal";
import Select from "../../UI/Select/Select";
import Pagination from "../../UI/Pagination/Pagination";
import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";
import "./RoomList.scss";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [role, setRole] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [filteredRooms, setFilteredRooms] = useState([]);

  const [statuses, setStatuses] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUnblockModal, setShowUnblockModal] = useState(false);

  const userString = localStorage.getItem("user");

  const token = localStorage.getItem("token");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedRoomNote, setSelectedRoomNote] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [roomsPerPage, setRoomsPerPage] = useState(7);

  const indexOfLastRoom = currentPage * roomsPerPage;

  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;

  const paginatedRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  if (!token) {
    window.location.href = "/login";
  }

  const options = { headers: { Authorization: "Bearer " + token } };

  const handleOpenNoteModal = (roomId, note, roomNumber) => {
    setSelectedRoomNote(note);
    setSelectedRoomId(roomId);
    setSelectedRoomNumber(roomNumber);
    setShowNoteModal(true);
  };

  const handleRemoveNote = async () => {
    if (!selectedRoomId) return;

    try {
      const res = await fetch(
        `http://localhost:5200/api/delete-room-note/${selectedRoomId}/note`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ note: "" }),
        }
      );

      const json = await res.json();

      if (json.error) {
        //toast.error(json.error);
        console.log(json.error);
      } else {
        //toast.success("Note removed.");
        setShowNoteModal(false);
        getRooms(); // reload updated data
      }
    } catch (err) {
      console.log("Error removing note.");
    }
  };

  async function getRooms() {
    const response = await fetch(
      "http://localhost:5200/api/room-list",
      options
    );
    const json = await response.json();
    setRooms(json);
  }

  const [search, setSearch] = useState("");

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:5200/api/room-list?search=${search}`,
        options
      );
      const json = await response.json();
      setRooms(json);
    } catch (error) {
      console.error("Error searching rooms:", error);
    }
  };

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

    setShowDeleteModal(false);
  }

  async function getStatuses() {
    const response = await fetch(
      "http://localhost:5200/api/room-statuses",
      options
    );
    const json = await response.json();
    setStatuses(["All", ...json]); //all za sve
  }

  useEffect(() => {
    getRooms();
    getStatuses();
    if (userString) {
      const user = JSON.parse(userString);
      setRole(user.role);
    }
  }, []);

  async function unblockRoom() {
    if (!selectedRoom) return;
    try {
      const res = await fetch(
        `http://localhost:5200/api/unblock-room/${selectedRoom._id}`,
        { method: "PUT", headers: options.headers }
      );
      const data = await res.json();
      if (data) {
        setRooms(
          rooms.map((r) =>
            r._id === selectedRoom._id ? { ...r, status: "free" } : r
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setShowUnblockModal(false);
    }
  }

  useEffect(() => {
    getRooms();
    getStatuses();
    if (userString) {
      const user = JSON.parse(userString);
      setRole(user.role);

      if (user.role === "receptionist") {
        setRoomsPerPage(10);
      } else {
        setRoomsPerPage(7);
      }
    }
  }, []);

  useEffect(() => {
    if (statusFilter === "All") {
      setFilteredRooms(rooms);
    } else {
      setFilteredRooms(rooms.filter((room) => room.status === statusFilter));
    }
  }, [statusFilter, rooms]);

  return (
    <>
      <div className="room-list">
        <h1
          className={`room-list-title ${
            role === "admin" ? "title-center" : "title-left"
          }`}
        >
          Room list
        </h1>

        <div className="room-list-top-bar">
          {role === "admin" && (
            <div className="left-section">
              <div className="new-options">
                <Link to="/add-room-type">
                  <Button variant="add" label="+ Type" />
                </Link>
                <Link to="/add-room-feature">
                  <Button variant="add" label="+ Feature" />
                </Link>
                <Link to="/add-room">
                  <Button variant="add" label="+ Add Room" />
                </Link>
              </div>
            </div>
          )}

          <div
            className={`right-section ${
              role === "receptionist" ? "right-section-receptionist" : ""
            }`}
          >
            <div className="room-list-filter-options">
              <Select
                className="room-list-select"
                name="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={statuses.map((s) => ({
                  value: s,
                  label: s,
                }))}
                placeholder="Status filter"
              />
            </div>
            <div className="room-list-search-options">
              <Input
                iconClass="fa-solid fa-magnifying-glass"
                name="roomSearch"
                placeholder="Search by room number"
                value={search}
                className="search-room"
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div
          className={`room-table-wrapper ${
            role === "receptionist" ? "room-table-wrapper-receptionist" : ""
          }`}
        >
          <table className="room-table">
            <thead>
              <tr>
                <th>Number</th>
                <th>Capacity</th>
                <th>Category</th>
                <th>Type</th>
                <th>Features</th>
                <th>Status</th>
                <th>Price</th>
                <th>Note</th>
                {role === "admin" && <th>Actions</th>}
                {role === "receptionist" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedRooms.map((room) => (
                <tr key={room._id}>
                  <td>{room.number}</td>
                  <td>{room.capacity}</td>
                  <td>{room.category.name}</td>
                  <td>{room.type?.name}</td>
                  <td>{room.features.map((f) => f.name).join(", ")}</td>
                  <td>{room.status}</td>
                  <td>{room.price} €</td>
                  <td>
                    {room?.note && (
                      <>
                        <br />
                        <small
                          className="room-note"
                          onClick={() =>
                            handleOpenNoteModal(
                              room._id,
                              room.note,
                              room.number
                            )
                          }
                        >
                          {room.note}
                        </small>
                      </>
                    )}
                  </td>
                  {role === "admin" && (
                    <td>
                      <div className="room-list-btns">
                        <Link to={`/edit-room/${room._id}`}>
                          <i className="fa-solid fa-pen-to-square"></i>
                        </Link>

                        <Button
                          variant="red"
                          onClick={() => {
                            setSelectedRoom(room);
                            setShowDeleteModal(true);
                          }}
                          label={<i className="fa-solid fa-trash" />}
                        />
                        {room.status === "blocked" ? (
                          <i
                            className="fa-solid fa-lock-open icon-unblock"
                            title="Unblock room"
                            onClick={() => {
                              setSelectedRoom(room);
                              setShowUnblockModal(true);
                            }}
                          />
                        ) : (
                          <Link to={`/block-room/${room._id}`}>
                            <i
                              className="fa-solid fa-lock icon-block"
                              title="Block room"
                            ></i>
                          </Link>
                        )}
                      </div>
                    </td>
                  )}
                  {role === "receptionist" && (
                    <td>
                      {room.status === "blocked" ? (
                        <i
                          className="fa-solid fa-lock-open icon-unblock-r"
                          title="Unblock room"
                          onClick={() => {
                            setSelectedRoom(room);
                            setShowUnblockModal(true);
                          }}
                        />
                      ) : (
                        <Link to={`/block-room/${room._id}`}>
                          <i
                            className="fa-solid fa-lock icon-block-r"
                            title="Block room"
                          ></i>
                        </Link>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          className={`room-list-pagination-wrapper ${
            role === "receptionist"
              ? "room-list-pagination-wrapper-receptionist"
              : ""
          }`}
        >
          <Pagination
            postsPerPage={roomsPerPage}
            totalPosts={filteredRooms.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>

        <ConfirmationModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          handleConfirm={deleteRoom}
          title="Confirm Deletion"
          body={`Are you sure you want to delete room #${selectedRoom?.number}?`}
          confirmLabel="Delete"
          closeLabel="Cancel"
        />

        <ConfirmationModal
          show={showUnblockModal}
          handleClose={() => setShowUnblockModal(false)}
          handleConfirm={unblockRoom}
          title="Confirm Unblock"
          body={
            <div>
              <p>
                Are you sure you want to unblock room #{selectedRoom?.number}?
              </p>
              {selectedRoom?.blockReason && (
                <>
                  <strong>Reason for blocking:</strong>
                  <p>{selectedRoom.blockReason}</p>
                </>
              )}
            </div>
          }
          confirmLabel="Unblock"
          closeLabel="Cancel"
          dialogClassName="unblock-room-dialog"
        />

        <ConfirmationModal
          show={showNoteModal}
          handleClose={() => setShowNoteModal(false)}
          handleConfirm={handleRemoveNote}
          title={`Note for Room ${selectedRoomNumber}`}
          body={
            <div>
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  marginBottom: "1rem",
                }}
              >
                {selectedRoomNote}
              </p>
              <p>
                If the problem is solved, you can now remove the note by
                clicking on the remove button.
              </p>
            </div>
          }
          confirmLabel="Remove Note"
          closeLabel="Close"
          dialogClassName="unblock-room-dialog"
        />
      </div>
    </>
  );
};

export default RoomList;
