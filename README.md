# Web-application-for-hotel-management-Thesis

A web application for managing hotel room reservations, housekeeping organization, and hotel administration.
The system supports multiple roles (guests, registered users, staff, and admin), each with a dedicated dashboard and permissions.

## Tech Stack

* **Frontend:** React.js
* **Backend:** Node.js (Express)
* **Database:** MongoDB
* **Payments:** PayPal (room reservation payments)

## Main Features

* Room availability search and booking
* Staff dashboards for daily operations (reception & housekeeping)
* Housekeeping task assignment and cleaning status tracking
* Admin panel for full hotel management
* Events and reviews management

## Roles & Permissions

### Guest (not logged in)

* Register / Log in
* Search and browse rooms by **date**, **price**, and **category**
* View hotel events
* View hotel reviews

### Registered User

* Log in / Log out
* Search and browse rooms by **date**, **price**, and **category**
* Reserve a room and pay via **PayPal** (option to include meals)
* Cancel a reservation
* View **upcoming** reservations
* View **past** reservations
* Leave a hotel review
* View hotel events and register attendance for events with limited capacity

### Receptionist

* Log in / Log out
* View daily **arrivals** and **departures**
* Filter rooms by status: **available**, **occupied**, **cleaned**, **blocked**
* Perform guest **check-in** and **check-out**

### Head Housekeeper

* Log in / Log out
* View all housekeepers
* View all rooms scheduled for check-out that day
* Assign rooms to housekeepers (daily cleaning tasks)
* Confirm cleaned rooms and leave notes if needed

### Housekeeper

* Log in / Log out
* View assigned rooms to clean
* Mark room status as **done** after cleaning and optionally leave a note

### Administrator

* Register / Log in / Log out
* Add / edit / delete staff (receptionists, housekeepers)
* Add / edit / delete rooms (including blocking rooms)
* Add / delete room categories
* View statistics:

  * total revenue (e.g., yearly revenue and monthly breakdown)
  * current hotel occupancy
* View all reservations and staff overview
* Create hotel events (e.g., wine tastings, mini concerts, promotions)
