import React, { useState, useEffect } from "react";
import { getTodayDate, formatDate } from "../../../utils/helper";
import Button from "../../UI/Button/Button";
import Pagination from "../../UI/Pagination/Pagination";
import LoadingComponent from "../../UI/Loading/Loading";
import "./MaidsCheckList.scss";

const MaidsCheckList = () => {
  const [date] = useState(getTodayDate);
  const [data, setData] = useState({ checkIns: [], checkOuts: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("checkIns");

  const [currentPage, setCurrentPage] = useState(1);

  const [roomsPerPage] = useState(8);

  const indexOfLastRoom = currentPage * roomsPerPage;

  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;

  const listToShow = activeTab === "checkIns" ? data.checkIns : data.checkOuts;
  const paginatedRooms = listToShow.slice(indexOfFirstRoom, indexOfLastRoom);

  const token = localStorage.getItem("token");
  if (!token) window.location.href = "/login";

  const options = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const getData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5200/api/arrivals-departures/?date=${date}`,
        options
      );
      const json = await res.json();
      setData(json || { checkIns: [], checkOuts: [] });
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  return (
    <>
      <div className="maids-checkList">
        <h2>Room list</h2>

        <div className="tabs-wrapper">
          <Button
            label="Check Ins"
            onClick={() => setActiveTab("checkIns")}
            variant={activeTab === "checkIns" ? "checkIn" : "checkOut"}
          />
          <Button
            label="Check Outs"
            onClick={() => setActiveTab("checkOuts")}
            variant={activeTab === "checkOuts" ? "checkIn" : "checkOut"}
          />
        </div>

        {loading ? (
          <LoadingComponent />
        ) : error ? (
          <p>{error}</p>
        ) : listToShow.length === 0 ? (
          <p className="maids-no-rooms">
            There are no available rooms that are on reservation.
          </p>
        ) : (
          <div className="maids-checkList-table-wrapper">
            <table className="maids-checkList-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Room</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Adults</th>
                  <th>Babies</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRooms.map((booking, index) => (
                  <tr key={booking._id}>
                    <td>{indexOfFirstRoom + index + 1}</td>

                    <td>{booking.room?.number || "N/A"}</td>
                    <td>{formatDate(booking.checkIn)}</td>
                    <td>{formatDate(booking.checkOut)}</td>
                    <td>{booking.adults}</td>
                    <td>
                      {booking.babies || 0}
                      {/* {activeTab === "checkIns" && booking.babies > 0 && ( TO DO VIDJETI JOS STA S OVIM
                        <div className="baby-note">
                          Set up {booking.babies} baby cot
                          {booking.babies > 1 ? "s" : ""}
                        </div>
                      )} */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination
          postsPerPage={roomsPerPage}
          totalPosts={listToShow.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
};
export default MaidsCheckList;
