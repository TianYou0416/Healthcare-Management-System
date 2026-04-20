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

function renderAppointments() {
  const upcoming = HMS_DATA.appointments.filter((item) => item.status === "Upcoming");
  const past = HMS_DATA.appointments.filter((item) => item.status === "Completed");
  HMS.renderShell("patient-appointments.html", `
    <section class="page">
      <div class="page-header"><h1 class="page-title">Appointments</h1><button class="button" id="bookingToggle">+ Book Appointment</button></div>
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
      <div class="grid grid-2" style="margin-bottom:32px">${upcoming.map(appointmentCard).join("")}</div>
      <h2>Past Appointments</h2>
      <div class="card list-divider">${past.map((apt) => `<div class="list-item row between"><div class="row"><span class="icon-box">${HMS.icon("user")}</span><div><strong>${apt.doctor}</strong><p class="small muted">${apt.specialty}</p></div></div><div style="text-align:right"><p>${apt.date}</p><p class="small muted">${apt.time}</p></div></div>`).join("")}</div>
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
  document.getElementById("confirmBooking")?.addEventListener("click", () => alert("Appointment booking confirmed."));
}

if (user) renderAppointments();
