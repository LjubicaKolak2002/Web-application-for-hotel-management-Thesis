import React, {useState} from "react";
import {BrowserRouter as Router,Routes,Route
} from "react-router-dom";
import Register from "./components/UserComponents/Register.js";
import Login from "./components/UserComponents/Login.js";
import HomePageTest from "./components/HomePageTest.js";
import Logout from "./components/UserComponents/Logout.js";
import AddStaff from "./components/UserComponents/AddStaff.js";
import StaffList from "./components/UserComponents/StaffList.js";
import EditStaff from "./components/UserComponents/EditStaff.js";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path="/" element={<HomePageTest/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/logout" element={<Logout/>}/>
            <Route path="/add-staff" element={<AddStaff/>}/>
            <Route path="/staff-list" element={<StaffList/>}/>
            <Route path="/edit-staff/:staff_id" element={<EditStaff/>}/>
          </Routes>
        </Router>
   
      </header>
    </div>
  );
}

export default App;
