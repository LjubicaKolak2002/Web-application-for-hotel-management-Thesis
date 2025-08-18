import React, { useState, useEffect } from "react";

import "./MaidsTable.scss";

const MaidsTable = () => {
  const [maids, setMaids] = useState([]);

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
  }

  const options = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  async function getMaids() {
    const response = await fetch("http://localhost:5200/api/maids", options);
    const json = await response.json();
    setMaids(json);
  }

  useEffect(() => {
    getMaids();
  }, []);

  return (
    <div className="maids-table-list">
      <h1>Maids list</h1>

      <div className="maids-table-wrapper">
        <table className="maids-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Surname</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {maids.map((maid) => (
              <tr key={maid._id}>
                <td>{maid.name}</td>
                <td>{maid.surname}</td>
                <td>{maid.username}</td>
                <td>{maid.email}</td>
                <td>{maid.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaidsTable;
