import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Layout/Register/Register.js";
import Login from "./components/Layout/Login/Login.js";
import Footer from "./components/UI/Footer/Footer.js";
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
import BlockRoom from "./components/Layout/BlockRoom/BlockRoom.js";
import UnblockRoom from "./components/Layout/UnblockRoom/UnblockRoom.js";
import EditRoom from "./components/Layout/EditRoom/EditRoom.js";
import AddEvent from "./components/Layout/AddEvent/AddEvent.js";
import EventList from "./components/Layout/EventList/EventList.js";
import EventDetails from "./components/Layout/EventDetails/EventDetails.js";
import AddRoomType from "./components/Layout/AddRoomType/AddRoomType.js";
import BookingForm from "./components/Layout/BookingForm/BookingForm.js";
import FutureReservations from "./components/Layout/FutureReservations/FutureReservations.js";
import PastReservations from "./components/Layout/PastReservations/PastReservations.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import SearchRooms from "./components/Layout/SearchRooms/SearchRooms.js";
import AvailableRoomsResults from "./components/Layout/AvailableRoomResult.js/AvailableRoomResult.js";
import Sidebar from "./components/UI/Sidebar/Sidebar.js";
import Navbar from "./components/UI/Navbar/Navbar.js";
import BookingConfirmation from "./components/Layout/BookingConfirmation/BookingConfirmation.js";
import UsersOnEvent from "./components/Layout/UsersOnEvent/UsersOnEvent.js";
import AddReview from "./components/Layout/AddReview/AddReview.js";
import Reviews from "./components/Layout/Reviews/Reviews.js";
import CheckList from "./components/Layout/CheckList/CheckList.js";
import MaidsList from "./components/Layout/MaidsList/MaidsList.js";
import MaidsCheckList from "./components/Layout/MaidsCheckList/MaidsCheckList.js";
import MaidsAssignedRooms from "./components/Layout/MaidsAssignedRooms/MaidsAssignedRooms.js";
import Statistics from "./components/Layout/Statistics/Statistics.js";
import AdminReviews from "./components/Layout/AdminReviews/AdminReviews.js";
import RoomChange from "./components/Layout/RoomChange/RoomChange.js";
import MaidsTable from "./components/Layout/MaidsTable/MaidsTable.js";

import "./App.scss";

function App() {
  const [user, setUser] = useState(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    const userString = localStorage.getItem("user");
    const currentUser = userString ? JSON.parse(userString) : null;

    setUser(currentUser);
    setIsUserLoaded(true);

    if (isStandalone && (!currentUser || currentUser.role !== "maid")) {
      console.log("my-role:", currentUser?.role);
      setAccessDenied(true);
    }
  }, []);

  if (accessDenied) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "100px",
          fontSize: "20px",
          color: "red",
        }}
      >
        The mobile app version is not available for you.
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "ATTLLPX95-Lo28BICHPw5ad-p9TbrTpDd6FjjQCW1QQlBGaAPGo_SxkC7vZLvGR2F0bQAXaZOYavSftA",
        currency: "EUR",
      }}
    >
      <div className="App">
        <Router>
          {isUserLoaded && (
            <>
              {user?.role === "user" || !user?.role ? (
                <Navbar
                  userName={user?.name || ""}
                  role={user?.role || ""}
                  id={user?.id}
                />
              ) : (
                <Sidebar
                  userName={user?.name || ""}
                  role={user?.role || ""}
                  id={user?.id}
                />
              )}
            </>
          )}
          <div className="content-with-navbar">
            <Routes>
              <Route path="/" element={<HomePageTest />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login onLogin={setUser} />} />

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
              <Route path="/add-room-type" element={<AddRoomType />} />
              <Route path="/add-room" element={<AddRoom />} />
              <Route path="/room-list" element={<RoomList />} />
              <Route path="/block-room/:room_id" element={<BlockRoom />} />
              <Route path="/unblock-room/:room_id" element={<UnblockRoom />} />
              <Route path="/edit-room/:room_id" element={<EditRoom />} />
              <Route path="/add-event" element={<AddEvent />} />
              <Route path="/events-list" element={<EventList />} />
              <Route path="/events/:event_id" element={<EventDetails />} />
              <Route path="/search-rooms-by-date" element={<SearchRooms />} />
              <Route
                path="/available-rooms-results"
                element={<AvailableRoomsResults />}
              />
              <Route path="/book-room/:room_id" element={<BookingForm />} />
              <Route
                path="/booking-confirmation/:user_id"
                element={<BookingConfirmation />}
              />
              <Route
                path="/my-future-reservations/:user_id"
                element={<FutureReservations />}
              />
              <Route
                path="/my-past-reservations/:user_id"
                element={<PastReservations />}
              />
              <Route
                path="/users-on-event/:event_id"
                element={<UsersOnEvent />}
              />
              <Route path="/add-review" element={<AddReview />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/admin-reviews" element={<AdminReviews />} />
              <Route path="/sidebar" element={<Sidebar />} />
              <Route path="/arrivals-departures" element={<CheckList />} />
              <Route path="/maids-list" element={<MaidsList />} />
              <Route path="/maids-checkList" element={<MaidsCheckList />} />
              <Route
                path="/maids-assigned-rooms"
                element={<MaidsAssignedRooms />}
              />
              <Route path="/statistics" element={<Statistics />} />

              <Route path="/change-room/:bookingId" element={<RoomChange />} />
              <Route path="/maids-table" element={<MaidsTable />} />
            </Routes>
          </div>
          {(user?.role === "user" || !user?.role) && <Footer />}
        </Router>
      </div>
    </PayPalScriptProvider>
  );
}

export default App;
