// BusGo Frontend: schedules are loaded with Fetch from data/buses.json.
// localStorage is used only to simulate changes until the real backend is added.
const $ = (id) => document.getElementById(id);
const STORAGE_KEY = "busgo_bookings_v1";
const EXTRA_KEY = "busgo_extra_buses_v1";
const STATUS_KEY = "busgo_trip_status_v1";

let buses = [];
let filteredBuses = [];
let selectedBus = null;

function readStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch { return fallback; }
}
function saveStorage(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function getBookings() { return readStorage(STORAGE_KEY, []); }
function money(value) { return "PKR " + Number(value).toLocaleString("en-PK"); }

async function loadBuses() {
  $("resultCount").textContent = "Loading schedules...";
  try {
    const response = await fetch("./data/buses.json");
    if (!response.ok) throw new Error("Could not load schedule file.");
    const data = await response.json();
    buses = data.concat(readStorage(EXTRA_KEY, []));
    filteredBuses = [...buses];
    renderBuses(filteredBuses);
    renderAdminBuses();
  } catch (error) {
    $("busList").innerHTML = `<p class="empty">Schedule data could not load. Start the project using VS Code Live Server.</p>`;
    $("resultCount").textContent = "Data loading error";
  }
}

function showPage(pageName) {
  document.querySelectorAll(".page").forEach(page => page.classList.toggle("active", page.id === pageName));
  document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.page === pageName));
  if (pageName === "bookings") renderBookings();
  if (pageName === "admin") renderAdminBuses();
  if (pageName === "driver") renderDriver();
}
document.querySelectorAll("[data-page]").forEach(button => {
  button.addEventListener("click", event => {
    event.preventDefault();
    showPage(button.dataset.page);
  });
});

function currentRole() { return $("roleSelect").value; }
$("roleSelect").addEventListener("change", () => {
  const role = currentRole();
  $("adminNotice").textContent = role === "admin" ? "Admin access is active in this frontend demo." : "Switch the demo role to Admin to manage schedules.";
  $("driverNotice").textContent = role === "driver" ? "Driver access is active. Update the trip status below." : "Switch the demo role to Driver to update trip status.";
  renderAdminBuses(); renderDriver();
});

function renderBuses(list) {
  $("resultCount").textContent = `${list.length} bus(es) found`;
  if (!list.length) { $("busList").innerHTML = '<div class="panel empty">No buses found for this search. Try another route or date.</div>'; return; }
  $("busList").innerHTML = list.map(bus => `
    <article class="bus-card">
      <h3>${escapeHTML(bus.name)}</h3>
      <div class="route">${escapeHTML(bus.from)} <span class="muted">→</span> ${escapeHTML(bus.to)}</div>
      <div class="bus-meta"><span>🕒 ${escapeHTML(bus.time)}</span><span>💺 ${Number(bus.seats)} seats</span></div>
      <div class="bus-meta"><span>${escapeHTML(bus.date || "Date to be confirmed")}</span><strong class="price">${money(bus.price)}</strong></div>
      <button class="primary-btn" data-book="${bus.id}">Select bus</button>
    </article>`).join("");
  document.querySelectorAll("[data-book]").forEach(btn => btn.addEventListener("click", () => openBooking(Number(btn.dataset.book))));
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}


$("searchForm").addEventListener("submit", event => {
  event.preventDefault();

  const from = $("from").value;
  const to = $("to").value;
  const date = $("travelDate").value;

  // Check that all fields are selected
  if (!from || !to || !date) {
    $("searchMessage").textContent = "Please select departure, destination and date.";
    return;
  }

  // Departure and destination cannot be the same
  if (from === to) {
    $("searchMessage").textContent =
      "Departure and destination must be different.";
    renderBuses([]);
    return;
  }

  $("searchMessage").textContent = "";

  // Search existing buses for selected route and date
  const availableBuses = buses.filter(bus =>
    !bus.demoGenerated &&
    bus.from.toLowerCase() === from.toLowerCase() &&
    bus.to.toLowerCase() === to.toLowerCase() &&
    bus.date === date
  );

  if (availableBuses.length > 0) {
    filteredBuses = availableBuses;
  } else {
    // Generate demo buses if no schedule exists
    filteredBuses = createDemoBuses(from, to, date);
  }

  // Display buses on the website
  renderBuses(filteredBuses);
});


// Generate demo buses for any selected route and date
function createDemoBuses(from, to, date) {

  const demoBuses = [
    {
      id: Date.now() + 1,
      name: "RoadStar Express",
      from: from,
      to: to,
      time: "08:00 AM",
      price: 3500,
      seats: 40,
      date: date,
      demoGenerated: true
    },
    {
      id: Date.now() + 2,
      name: "SkyWays Coach",
      from: from,
      to: to,
      time: "02:00 PM",
      price: 4000,
      seats: 36,
      date: date,
      demoGenerated: true
    },
    {
      id: Date.now() + 3,
      name: "FastTrack Travels",
      from: from,
      to: to,
      time: "09:00 PM",
      price: 4500,
      seats: 40,
      date: date,
      demoGenerated: true
    }
  ];

  // Add generated buses so booking can find them
  buses = buses.filter(bus => !bus.demoGenerated);
  buses.push(...demoBuses);

  return demoBuses;
}

function openBooking(busId) {
  if (currentRole() !== "passenger") { alert("Please switch the demo role to Passenger to make a booking."); return; }
  selectedBus = buses.find(bus => bus.id === busId);
  if (!selectedBus) return;
  $("selectedBusId").value = selectedBus.id;
  $("dialogBusTitle").textContent = selectedBus.name;
  $("dialogBusInfo").textContent = `${selectedBus.from} to ${selectedBus.to} · ${money(selectedBus.price)}`;
  const bookedSeats = getBookings().filter(item => item.busId === busId && item.status !== "Cancelled").map(item => item.seat);
  $("seatNumber").innerHTML = Array.from({length:Number(selectedBus.seats)}, (_,i) => i+1)
    .filter(number => !bookedSeats.includes(number))
    .map(number => `<option value="${number}">Seat ${number}</option>`).join("");
  $("bookingMessage").textContent = "";
  if (!$("seatNumber").options.length) { alert("Sorry, all seats are booked."); return; }
  $("bookingDialog").showModal();
}
$("closeDialog").addEventListener("click", () => $("bookingDialog").close());

$("bookingForm").addEventListener("submit", event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const busId = Number($("selectedBusId").value);
  const seat = Number($("seatNumber").value);
  const bookings = getBookings();
  if (bookings.some(item => item.busId === busId && item.seat === seat && item.status !== "Cancelled")) {
    $("bookingMessage").textContent = "This seat has just been booked. Please choose another seat."; return;
  }
  const bus = buses.find(item => item.id === busId);
  bookings.push({id:Date.now(),busId,busName:bus.name,from:bus.from,to:bus.to,date:bus.date,seat,
    passenger:$("passengerName").value.trim(),phone:$("passengerPhone").value.trim(),
    amount:bus.price,status:"Confirmed",tripStatus:"Scheduled"});
  saveStorage(STORAGE_KEY, bookings);
  $("bookingDialog").close();
  event.currentTarget.reset();
  alert("Booking confirmed! You can view it in My Bookings.");
  showPage("bookings");
});

function renderBookings() {
  const bookings = getBookings();
  if (!bookings.length) { $("bookingList").innerHTML = '<div class="empty">You have no bookings yet. Search for a bus to get started.</div>'; return; }
  $("bookingList").innerHTML = `<div class="table-wrap"><table><thead><tr><th>Passenger</th><th>Route</th><th>Date</th><th>Seat</th><th>Fare</th><th>Status</th><th>Action</th></tr></thead><tbody>
    ${bookings.map(item => `<tr><td>${escapeHTML(item.passenger)}</td><td>${escapeHTML(item.from)} → ${escapeHTML(item.to)}</td><td>${escapeHTML(item.date)}</td><td>${item.seat}</td><td>${money(item.amount)}</td><td><span class="status">${escapeHTML(item.status)}</span></td><td>${item.status === "Confirmed" ? `<button class="small-btn danger" data-cancel="${item.id}">Cancel</button>` : "—"}</td></tr>`).join("")}
    </tbody></table></div>`;
  document.querySelectorAll("[data-cancel]").forEach(btn => btn.addEventListener("click", () => cancelBooking(Number(btn.dataset.cancel))));
}
function cancelBooking(id) {
  const bookings = getBookings();
  const booking = bookings.find(item => item.id === id);
  if (!booking || booking.status !== "Confirmed") return;
  if (!confirm("Cancel this booking?")) return;
  booking.status = "Cancelled";
  saveStorage(STORAGE_KEY, bookings);
  renderBookings();
}

$("busForm").addEventListener("submit", event => {
  event.preventDefault();
  if (currentRole() !== "admin") { alert("Only Admin can add schedules."); return; }
  if (!event.currentTarget.reportValidity()) return;
  const from = $("busFrom").value.trim(), to = $("busTo").value.trim();
  const price = Number($("busPrice").value), seats = Number($("busSeats").value);
  if (from.toLowerCase() === to.toLowerCase() || price <= 0 || seats < 1 || seats > 60) {
    alert("Please enter a valid route, price and seat count."); return;
  }
  const newBus = {id:Date.now(),name:$("busName").value.trim(),from,to,time:$("busTime").value,
    price,seats,date:$("travelDate").value || new Date().toISOString().slice(0,10)};
  const extra = readStorage(EXTRA_KEY, []);
  extra.push(newBus); saveStorage(EXTRA_KEY, extra);
  buses.push(newBus); event.currentTarget.reset();
  renderAdminBuses(); renderBuses(buses);
  alert("New schedule added in this browser demo.");
});

function renderAdminBuses() {
  if (currentRole() !== "admin") { $("adminBusList").innerHTML = '<p class="empty">Admin actions are hidden. Select Admin in the Demo role menu.</p>'; return; }
  if (!buses.length) { $("adminBusList").innerHTML = '<p class="empty">No schedules available.</p>'; return; }
  $("adminBusList").innerHTML = `<div class="table-wrap"><table><thead><tr><th>Bus</th><th>Route</th><th>Time</th><th>Fare</th><th>Action</th></tr></thead><tbody>
    ${buses.map(bus => `<tr><td>${escapeHTML(bus.name)}</td><td>${escapeHTML(bus.from)} → ${escapeHTML(bus.to)}</td><td>${escapeHTML(bus.time)}</td><td>${money(bus.price)}</td><td><button class="small-btn danger" data-delete="${bus.id}">Remove</button></td></tr>`).join("")}
    </tbody></table></div>`;
  document.querySelectorAll("[data-delete]").forEach(btn => btn.addEventListener("click", () => deleteBus(Number(btn.dataset.delete))));
}
function deleteBus(id) {
  if (currentRole() !== "admin" || !confirm("Remove this schedule from the demo?")) return;
  const extra = readStorage(EXTRA_KEY, []).filter(bus => bus.id !== id);
  saveStorage(EXTRA_KEY, extra);
  buses = buses.filter(bus => bus.id !== id);
  renderAdminBuses(); renderBuses(buses);
}

function renderDriver() {
  if (currentRole() !== "driver") { $("driverList").innerHTML = '<p class="empty">Driver actions are hidden. Select Driver in the Demo role menu.</p>'; return; }
  const bookings = getBookings();
  if (!bookings.length) { $("driverList").innerHTML = '<p class="empty">No passenger trips are available yet. Create a passenger booking first.</p>'; return; }
  $("driverList").innerHTML = bookings.map(item => `<div class="driver-row">
    <strong>${escapeHTML(item.from)} → ${escapeHTML(item.to)}</strong>
    <p class="muted">${escapeHTML(item.passenger)} · Seat ${item.seat} · ${escapeHTML(item.date)}</p>
    <label for="trip-${item.id}">Trip status</label>
    <select id="trip-${item.id}" data-trip="${item.id}">
      ${["Scheduled","Arrived","Completed","Failed"].map(status => `<option ${item.tripStatus===status?"selected":""}>${status}</option>`).join("")}
    </select>
  </div><hr>`).join("");
  document.querySelectorAll("[data-trip]").forEach(select => select.addEventListener("change", () => {
    const list = getBookings(), item = list.find(row => row.id === Number(select.dataset.trip));
    if (item) { item.tripStatus = select.value; saveStorage(STORAGE_KEY, list); }
  }));
}

$("travelDate").min = new Date().toISOString().slice(0,10);
$("travelDate").value = "2026-11-20";
loadBuses();
