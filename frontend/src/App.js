import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Layout/Register/Register.js";
import Login from "./components/Layout/Login/Login.js";
import HomePageTest from "./components/HomePageTest.js";
import Logout from "./components/Layout/Logout/Logout.js";
import AddStaff from "./components/Layout/AddStaff/AddStaff.js";
import StaffList from "./components/Layout/StaffList/StaffList.js";
import EditStaff from "./components/Layout/EditStaff/EditStaff.js";
import AddRoomCategory from "./components/Layout/AddRoomCategory/AddRoomCategory.js";
import RoomCategoriesList from "./components/Layout/RoomCategoriesList/RoomCategoriesList.js";
import AddRoomFeature from "./components/Layout/AddRoomFeature/AddRoomFeature.js";
import AddRoom from "./components/Layout/AddRoom/AddRoom.js";
import RoomList from "./components/Layout/RoomList/RoomList.js";
import "bootstrap/dist/css/bootstrap.min.css";
import BlockRoom from "./components/Layout/BlockRoom/BlockRoom.js";
import UnblockRoom from "./components/Layout/UnblockRoom/UnblockRoom.js";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path="/" element={<HomePageTest />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/add-staff" element={<AddStaff />} />
            <Route path="/staff-list" element={<StaffList />} />
            <Route path="/edit-staff/:staff_id" element={<EditStaff />} />
            <Route path="/add-room-category" element={<AddRoomCategory />} />
            <Route
              path="/room-categories-list"
              element={<RoomCategoriesList />}
            />
            <Route path="/add-room-feature" element={<AddRoomFeature />} />
            <Route path="/add-room" element={<AddRoom />} />
            <Route path="/room-list" element={<RoomList />} />
            <Route path="/block-room/:room_id" element={<BlockRoom />} />
            <Route path="/unblock-room/:room_id" element={<UnblockRoom />} />
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
