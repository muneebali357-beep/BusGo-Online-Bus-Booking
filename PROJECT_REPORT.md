# BusGo – Online Bus Ticket Booking System
## Frontend Project Report

### 1. Introduction
BusGo is a web-based bus ticket booking prototype. It helps passengers view available bus schedules, search between cities, select a seat and manage their demo bookings. It also provides separate Admin and Driver views to demonstrate role-based actions.

### 2. Objectives
- Provide a simple interface for searching bus schedules.
- Allow passengers to select seats and create bookings.
- Display booking records and allow cancellation.
- Allow an Admin demo role to manage schedules.
- Allow a Driver demo role to update trip status.
- Build a responsive frontend that can later connect to a real backend.

### 3. Technologies
- HTML5: page structure and forms.
- CSS3: layout, styling and responsive media queries.
- JavaScript: events, validation, Fetch API and dynamic DOM rendering.
- JSON: sample bus schedule data.
- localStorage: temporary frontend demonstration storage.

### 4. Main Modules
**Passenger:** searches routes, views bus details, selects a seat, enters passenger information, confirms a booking and views/cancels bookings.

**Admin:** adds and removes bus schedules in the frontend demo.

**Driver:** updates the trip status of demo bookings.

### 5. Data Flow
When the application starts, JavaScript fetches `data/buses.json`. After receiving the response, it converts the response into JSON and renders the bus cards dynamically. When the user books a seat, the frontend validates the form and stores the demo booking in localStorage. The backend phase will replace this temporary storage with API requests and a database.

### 6. Validation and Responsive Design
Required fields are used in forms. Passenger name, phone number, seat selection, route, price and seat count are validated. CSS Grid, Flexbox and media queries are used to support laptop and small mobile screens.

### 7. Use Case Diagram (text description)
Actors: Passenger, Admin and Driver.
- Passenger → Search Buses, Select Seat, Book Ticket, View Bookings, Cancel Booking.
- Admin → Add Bus Schedule, Remove Bus Schedule.
- Driver → View Assigned Demo Trips, Update Trip Status.

### 8. Assumptions and Limitations
This is the frontend phase only. Demo role selection is not secure login. Sample data is used. Booking and schedule changes are saved in the browser, not on a server. Real payment, secure authentication, database storage, concurrent seat locking and server-side authorization will be developed in the backend phase.

### 9. Testing
The application should be tested for route search, same-city validation, empty form submission, valid booking, duplicate seat prevention in the same browser, booking cancellation, Admin schedule management, Driver status updates and mobile layout.

### 10. Conclusion
BusGo provides the main frontend flow for a bus ticket booking system and demonstrates Fetch-based JSON loading, dynamic rendering, form validation, role-based interface actions and responsive design. It is structured so that a backend API can replace the demo storage in the next phase.
