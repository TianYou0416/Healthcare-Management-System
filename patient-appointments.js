const user = HMS.protect("patient");
let bookingOpen = false;

function appointmentCard(apt) {
  return `
    <article class="card pad">
      <div class="row between start">
        <div class="row start"><span class="icon-box">${HMS.icon("user")}</span><div><h3>${apt.doctor}</h3><p class="small muted">${apt.specialty}</p></div></div>
        <span class="badge blue">${apt.status}</span>
      </div>
      <p class="small muted">${HMS.icon("calendar")} ${apt.date} &nbsp; ${apt.time}</p>
      <div class="grid grid-2"><button class="button soft">Reschedule</button><button class="button danger">Cancel</button></div>
    </article>
  `;
}

function emptyAppointmentState(title, copy) {
  return `
    <div class="card">
      <div class="empty-state">
        <span class="icon-box">${HMS.icon("calendar")}</span>
        <h3>${title}</h3>
        <p class="muted empty-state-copy">${copy}</p>
      </div>
    </div>
  `;
}

function renderAppointments() {
  const upcoming = [];
  const past = [];
  HMS.renderShell("patient-appointments.html", `
    <section class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Appointments</h1>
          <p class="page-subtitle">Your upcoming and completed appointments will appear here once bookings are created.</p>
        </div>
        <button class="button" id="bookingToggle">+ Book Appointment</button>
      </div>
      <div class="card pad booking-panel ${bookingOpen ? "" : "hidden"}">
        <h3>Book New Appointment</h3>
        <div class="grid grid-2">
          ${HMS.selectField("Specialty", ["General Physician", "Cardiologist", "Dermatologist", "Orthopedic"])}
          ${HMS.selectField("Doctor", ["Dr. Sarah Johnson", "Dr. Michael Chen", "Dr. Emily Davis"])}
          <div class="field"><label>Date</label><input class="input" type="date"></div>
          ${HMS.selectField("Time", ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"])}
          <div class="field" style="grid-column:1/-1"><label>Reason for Visit</label><textarea class="textarea" rows="3" placeholder="Describe your symptoms or reason for visit"></textarea></div>
        </div>
        <p><button class="button" id="confirmBooking">Confirm Booking</button> <button class="button secondary" id="bookingCancel">Cancel</button></p>
      </div>
      <h2>Upcoming Appointments</h2>
      <div style="margin-bottom:32px">${upcoming.length ? `<div class="grid grid-2">${upcoming.map(appointmentCard).join("")}</div>` : emptyAppointmentState("No Upcoming Appointments", "You do not have any upcoming appointments yet. Once you book one, it will appear here.")}</div>
      <h2>Past Appointments</h2>
      <div>${past.length ? `<div class="card list-divider">${past.map((apt) => `<div class="list-item row between"><div class="row"><span class="icon-box">${HMS.icon("user")}</span><div><strong>${apt.doctor}</strong><p class="small muted">${apt.specialty}</p></div></div><div style="text-align:right"><p>${apt.date}</p><p class="small muted">${apt.time}</p></div></div>`).join("")}</div>` : emptyAppointmentState("No Past Appointments", "Completed or previous appointments will show up here after your first confirmed visit.")}</div>
    </section>
  `);
  document.getElementById("bookingToggle").addEventListener("click", () => {
    bookingOpen = !bookingOpen;
    renderAppointments();
  });
  document.getElementById("bookingCancel")?.addEventListener("click", () => {
    bookingOpen = false;
    renderAppointments();
  });
  document.getElementById("confirmBooking")?.addEventListener("click", () => alert("Appointment booking flow is ready. Database saving will be connected next."));
}

if (user) renderAppointments();
