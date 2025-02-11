import React, {useState} from "react";
import {BrowserRouter as Router,Routes,Route
} from "react-router-dom";
import Register from "./components/Register.js";
import Login from "./components/Login.js";
import HomePageTest from "./components/HomePageTest.js";
import Logout from "./components/Logout.js";

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
          </Routes>
        </Router>
   
      </header>
    </div>
  );
}

export default App;
