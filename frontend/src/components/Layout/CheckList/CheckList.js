import React, { useState, useEffect } from "react";
import DateInput from "../../UI/Date/Date";
import { getTodayDate, formatDate } from "../../../utils/helper";
import Select from "../../UI/Select/Select";
import Button from "../../UI/Button/Button";
import ConfirmationModal from "../../UI/Modal/Modal";
import Pagination from "../../UI/Pagination/Pagination";
import LoadingComponent from "../../UI/Loading/Loading";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import "./CheckList.scss";

const CheckList = () => {
  const [date, setDate] = useState(getTodayDate);
  const [data, setData] = useState({ checkIns: [], checkOuts: [] });
  const [activeTab, setActiveTab] = useState("checkIns");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedRoomNote, setSelectedRoomNote] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState("");

  const token = localStorage.getItem("token");

  const [currentPage, setCurrentPage] = useState(1);

  const [roomsPerPage] = useState(7); //TO DO POVECATI

  const indexOfLastRoom = currentPage * roomsPerPage;

  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;

  const listToShow = activeTab === "checkIns" ? data.checkIns : data.checkOuts;
  const paginatedRooms = listToShow.slice(indexOfFirstRoom, indexOfLastRoom);

  if (!token) {
    window.location.href = "/login";
  }

  const options = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  async function getData() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5200/api/arrivals-departures/?date=${date}`,
        options
      );
      const json = await res.json();
      setData(json || { checkIns: [], checkOuts: [] });
    } catch (err) {
      setError("Error loading reservations.");
      setData({ checkIns: [], checkOuts: [] });
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(bookingId, newStatus) {
    try {
      const res = await fetch(
        `http://localhost:5200/api/update-status/${bookingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const json = await res.json();

      if (json.error) {
        toast.error(json.error);
      } else {
        toast.success("Room status successfully updated.");
        getData();
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Error while updating status.");
    }
  }

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
        toast.error(json.error);
      } else {
        toast.success("Note removed.");
        setShowNoteModal(false);
        getData(); // reload updated data
      }
    } catch (err) {
      toast.error("Error removing note.");
    }
  };

  useEffect(() => {
    getData();
    setCurrentPage(1);
  }, [date, activeTab]);

  const getStatusOptions = (booking) => {
    const { status } = booking;

    if (activeTab === "checkIns" && status === "reserved") {
      return [
        { value: "reserved", label: "reserved" },
        { value: "checked in", label: "checked in" },
      ];
    }

    if (activeTab === "checkOuts" && status === "checked in") {
      return [
        { value: "checked in", label: "checked in" },
        { value: "checked out", label: "checked out" },
      ];
    }

    return [{ value: status, label: status }];
  };

  return (
    <div className="check-list">
      <div className="check-list-header">
        <div className="check-list-date-picker-wrapper">
          <div className="date-input-wrapper">
            <DateInput
              className="date-input-check-list"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <i className="fa-solid fa-calendar calendar-icon"></i>
          </div>

          <Button onClick={() => setDate(getTodayDate())} label="Today" />
        </div>

        <div className="check-list-tabs-wrapper">
          <Button
            label="Arrivals"
            onClick={() => setActiveTab("checkIns")}
            variant={activeTab === "checkIns" ? "checkIn" : "checkOut"}
          />
          <Button
            label="Departures"
            onClick={() => setActiveTab("checkOuts")}
            variant={activeTab === "checkOuts" ? "checkIn" : "checkOut"}
          />
        </div>
      </div>

      {loading && <LoadingComponent />}

      {!loading && (
        <>
          <h3>
            {activeTab === "checkIns"
              ? `Arrival${listToShow.length === 1 ? "" : "s"}`
              : `Departure${listToShow.length === 1 ? "" : "s"}`}{" "}
            – {listToShow.length}
          </h3>

          {listToShow.length === 0 ? (
            <p className="check-list-no-reservations">
              No available reservations on this day.
            </p>
          ) : (
            <div className="checkList-table-wrapper">
              <table className="checkList-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Guest</th>
                    <th>Room</th>
                    <th>Check in</th>
                    <th>Check out</th>
                    <th>Adults</th>
                    <th>Babies</th>
                    <th>Meals</th>
                    <th>Price</th>
                    <th>Country</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRooms.map((booking, index) => (
                    <tr key={booking._id}>
                      <td>{indexOfFirstRoom + index + 1}</td>

                      <td>
                        {booking.user?.name || "Unknown"}{" "}
                        {booking.user?.surname}
                      </td>
                      <td>
                        {booking.room?.number || "N/A"}
                        {activeTab === "checkIns" && booking.room?.note && (
                          <>
                            <br />
                            <Link to={`/change-room/${booking._id}`}>
                              Change room
                            </Link>
                          </>
                        )}
                      </td>

                      <td>{formatDate(booking.checkIn)}</td>
                      <td>{formatDate(booking.checkOut)}</td>
                      <td>{booking.adults}</td>
                      <td>
                        {booking.babies}
                        {/*  <br />  TO DO VIDIT JOS
                        <label className="babyBed">
                          {activeTab === "checkIns" &&
                            booking.babies > 0 &&
                            `Set ${booking.babies} baby bed${
                              booking.babies > 1 ? "s" : ""
                            }`}
                        </label> */}
                      </td>

                      <td>
                        {booking.meals?.length > 0
                          ? booking.meals.join(", ")
                          : "—"}
                      </td>
                      <td>
                        {booking.totalPrice?.$numberDecimal
                          ? parseFloat(
                              booking.totalPrice.$numberDecimal
                            ).toFixed(2) + " EUR"
                          : "N/A"}
                      </td>
                      <td>
                        {booking.user?.country?.name ? (
                          <>
                            <img
                              src={`https://flagcdn.com/24x18/${booking.user.country.code.toLowerCase()}.png`}
                              alt={booking.user.country.name}
                              width="24"
                              height="18"
                              style={{ marginRight: "8px" }}
                            />
                            {booking.user.country.name}
                          </>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td>
                        {activeTab === "checkIns" ? (
                          booking.room?.status === "clean" ? (
                            <>
                              <Select
                                className="select-checks"
                                name="statusSelect"
                                value={booking.status}
                                onChange={(e) =>
                                  updateStatus(booking._id, e.target.value)
                                }
                                options={getStatusOptions(booking)}
                              />
                              {booking.room?.note && (
                                <>
                                  <br />
                                  <small
                                    className="messageCheckIn clickable-note"
                                    onClick={() =>
                                      handleOpenNoteModal(
                                        booking.room._id,
                                        booking.room.note,
                                        booking.room.number
                                      )
                                    }
                                  >
                                    Note: {booking.room.note}
                                  </small>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              <span
                                className={`status-label status-${booking.status.replace(
                                  " ",
                                  "-"
                                )}`}
                              >
                                {booking.status}
                              </span>
                              {booking.status !== "checked in" && (
                                <>
                                  <br />
                                  <small className="messageCheckIn">
                                    {booking.room?.status === "dirty"
                                      ? "Not ready yet"
                                      : booking.room?.status === "blocked"
                                      ? "Room is blocked"
                                      : booking.room?.status === "occupied"
                                      ? "Room is occupied"
                                      : booking.room?.note
                                      ? "Note: " + booking.room.note
                                      : "Not ready yet"}
                                  </small>
                                  {booking.room?.note && <></>}
                                </>
                              )}
                            </>
                          )
                        ) : booking.status === "checked out" ? (
                          <span className="status-label status-checked-out">
                            {booking.status}
                          </span>
                        ) : (
                          <Select
                            className="select-checks"
                            name="statusSelect"
                            value={booking.status}
                            onChange={(e) =>
                              updateStatus(booking._id, e.target.value)
                            }
                            options={getStatusOptions(booking)}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Pagination
        postsPerPage={roomsPerPage}
        totalPosts={listToShow.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
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
              If the problem is solved, you can now remove the note by clicking
              on the remove button.
            </p>
          </div>
        }
        confirmLabel="Remove Note"
        closeLabel="Close"
      />
    </div>
  );
};

export default CheckList;
