# BusGo – Online Bus Ticket Booking System

## Project overview
BusGo is a frontend prototype for searching intercity bus schedules, selecting seats, creating bookings and viewing trip information. It is built with HTML5, CSS3 and JavaScript.

## Run the project
1. Install Visual Studio Code.
2. Open the `BusGo_Project` folder in VS Code.
3. Install the **Live Server** extension (Ritwick Dey).
4. Right-click `index.html` and select **Open with Live Server**.
5. The project opens in your browser. Do not open the HTML file directly because browser Fetch requests need a local server.

## Demo roles
Use the Demo role dropdown:
- Passenger: search buses, book a seat, view/cancel own demo bookings.
- Admin: add and remove bus schedules.
- Driver: update the trip status of demo bookings.

This is a frontend-only demonstration. The role dropdown is for demonstrating UI permissions; it is NOT secure authentication. Bookings and added schedules are stored in the current browser using localStorage.

## Data flow
1. `script.js` calls `fetch("./data/buses.json")`.
2. The JSON response is converted using `response.json()`.
3. JavaScript creates bus cards and table rows dynamically.
4. Booking and schedule changes are temporarily saved in localStorage.
5. In the backend phase, localStorage operations and the JSON file will be replaced with real API endpoints and database operations.

## API contract (planned for backend phase)
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/buses` | List/search bus schedules |
| GET | `/api/buses/{id}` | Get one schedule |
| POST | `/api/bookings` | Create a booking |
| GET | `/api/bookings/my` | Get current passenger bookings |
| PATCH | `/api/bookings/{id}/cancel` | Cancel a booking |
| PATCH | `/api/trips/{id}/status` | Driver updates trip status |
| POST | `/api/admin/buses` | Admin creates a schedule |
| DELETE | `/api/admin/buses/{id}` | Admin removes a schedule |

## Assumptions
- This submission is the frontend phase; server, database and real authentication are planned for the backend phase.
- Sample schedule data is provided in `data/buses.json`.
- For this demo, each bus schedule has a fixed number of seats.
- A seat cannot be booked twice in the same browser demo.
- Fare is displayed in Pakistani Rupees (PKR).
- Demo dates are sample data and should be updated for a presentation.

## Testing checklist
- Search with valid route/date and check that matching buses appear.
- Try selecting the same city as origin and destination.
- Book a seat with valid passenger details.
- Try submitting the booking form with missing/invalid details.
- Cancel a confirmed booking.
- Switch to Admin and add/remove a bus.
- Switch to Driver and update a trip status.
- Test at laptop width and at approximately 360px mobile width.

## Limitations
This prototype does not process real payments, send SMS, authenticate users securely, or store data on a server. These features belong in the backend phase.
