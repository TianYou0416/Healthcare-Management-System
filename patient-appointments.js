import { db } from "./firebase-config.js";
import { addDoc, collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const user = HMS.protect("patient");
let bookingOpen = false;
let isSaving = false;
let statusMessage = "";
let statusType = "";
let currentAppointments = [];
let editingAppointmentId = null;
let formValues = {
  specialty: "General Physician",
  doctor: "Dr. Sarah Johnson",
  date: "",
  time: "9:00 AM",
  reason: ""
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeStatus(status) {
  const normalized = String(status || "").trim().toLowerCase();
  if (normalized === "upcoming" || normalized === "scheduled" || normalized === "confirmed") return "Upcoming";
  if (normalized === "completed" || normalized === "past") return "Completed";
  if (normalized === "cancelled" || normalized === "canceled") return "Cancelled";
  return "Upcoming";
}

function sortAppointments(list) {
  return [...list].sort((a, b) => {
    const aDate = `${a.date || ""} ${a.time || ""}`;
    const bDate = `${b.date || ""} ${b.time || ""}`;
    return aDate.localeCompare(bDate);
  });
}

function isPastDate(dateString) {
  if (!dateString) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const appointmentDate = new Date(`${dateString}T00:00:00`);
  return !Number.isNaN(appointmentDate.getTime()) && appointmentDate < today;
}

function classifyAppointment(appointment) {
  const normalizedStatus = normalizeStatus(appointment.status);
  if (normalizedStatus === "Cancelled") return "Cancelled";
  if (normalizedStatus === "Completed" || isPastDate(appointment.date)) return "Completed";
  return "Upcoming";
}

function statusBadgeClass(status) {
  if (status === "Cancelled") return "red";
  if (status === "Completed") return "green";
  return "blue";
}

function updateFormValuesFromDom() {
  const specialtyInput = document.getElementById("specialtyInput");
  const doctorInput = document.getElementById("doctorInput");
  const dateInput = document.getElementById("dateInput");
  const timeInput = document.getElementById("timeInput");
  const reasonInput = document.getElementById("reasonInput");

  if (!specialtyInput) return;

  formValues = {
    specialty: specialtyInput.value,
    doctor: doctorInput.value,
    date: dateInput.value,
    time: timeInput.value,
    reason: reasonInput.value
  };
}

function resetFormValues() {
  editingAppointmentId = null;
  formValues = {
    specialty: "General Physician",
    doctor: "Dr. Sarah Johnson",
    date: "",
    time: "9:00 AM",
    reason: ""
  };
}

function appointmentCard(apt) {
  return `
    <article class="card pad">
      <div class="row between start">
        <div class="row start"><span class="icon-box">${HMS.icon("user")}</span><div><h3>${escapeHtml(apt.doctor || "-")}</h3><p class="small muted">${escapeHtml(apt.specialty || "-")}</p></div></div>
        <span class="badge ${statusBadgeClass(apt.displayStatus)}">${escapeHtml(apt.displayStatus || "Upcoming")}</span>
      </div>
      <p class="small muted">${HMS.icon("calendar")} ${escapeHtml(apt.date || "-")} &nbsp; ${escapeHtml(apt.time || "-")}</p>
      <p class="small muted">${escapeHtml(apt.reason || "No visit reason added.")}</p>
      <div class="grid grid-2">
        <button class="button soft reschedule-appointment" data-id="${escapeHtml(apt.id)}">Reschedule</button>
        <button class="button danger cancel-appointment" data-id="${escapeHtml(apt.id)}" ${isSaving ? "disabled" : ""}>Cancel</button>
      </div>
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

async function fetchAppointments() {
  const queriesToTry = [
    query(collection(db, "appointments"), where("patientUserId", "==", user.id)),
    query(collection(db, "appointments"), where("userId", "==", user.id)),
    query(collection(db, "appointments"), where("patientEmail", "==", user.email))
  ];

  for (const lookupQuery of queriesToTry) {
    const snapshot = await getDocs(lookupQuery);
    if (!snapshot.empty) {
      return snapshot.docs.map((documentSnapshot) => ({
        id: documentSnapshot.id,
        ...documentSnapshot.data()
      }));
    }
  }

  return [];
}

function renderAppointments(appointments) {
  currentAppointments = appointments;
  const normalizedAppointments = appointments.map((appointment) => ({
    ...appointment,
    normalizedStatus: normalizeStatus(appointment.status),
    displayStatus: classifyAppointment(appointment)
  }));
  const upcoming = sortAppointments(normalizedAppointments.filter((item) => item.displayStatus === "Upcoming"));
  const past = sortAppointments(normalizedAppointments.filter((item) => item.displayStatus !== "Upcoming")).reverse();

  HMS.renderShell("patient-appointments.html", `
    <section class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Appointments</h1>
          <p class="page-subtitle">Your upcoming and completed appointments will appear here once bookings are created.</p>
        </div>
        <button class="button" id="bookingToggle">+ Book Appointment</button>
      </div>
      ${statusMessage && !bookingOpen ? `<p class="appointment-message ${statusType}">${escapeHtml(statusMessage)}</p>` : ""}
      <div class="card pad booking-panel ${bookingOpen ? "" : "hidden"}">
        <h3>${editingAppointmentId ? "Reschedule Appointment" : "Book New Appointment"}</h3>
        ${statusMessage ? `<p class="appointment-message ${statusType}">${escapeHtml(statusMessage)}</p>` : ""}
        <div class="grid grid-2">
          <div class="field">
            <label>Specialty</label>
            <select class="select" id="specialtyInput">
              <option ${formValues.specialty === "General Physician" ? "selected" : ""}>General Physician</option>
              <option ${formValues.specialty === "Cardiologist" ? "selected" : ""}>Cardiologist</option>
              <option ${formValues.specialty === "Dermatologist" ? "selected" : ""}>Dermatologist</option>
              <option ${formValues.specialty === "Orthopedic" ? "selected" : ""}>Orthopedic</option>
            </select>
          </div>
          <div class="field">
            <label>Doctor</label>
            <select class="select" id="doctorInput">
              <option ${formValues.doctor === "Dr. Sarah Johnson" ? "selected" : ""}>Dr. Sarah Johnson</option>
              <option ${formValues.doctor === "Dr. Michael Chen" ? "selected" : ""}>Dr. Michael Chen</option>
              <option ${formValues.doctor === "Dr. Emily Davis" ? "selected" : ""}>Dr. Emily Davis</option>
            </select>
          </div>
          <div class="field"><label>Date</label><input class="input" id="dateInput" type="date" value="${escapeHtml(formValues.date)}"></div>
          <div class="field">
            <label>Time</label>
            <select class="select" id="timeInput">
              <option ${formValues.time === "9:00 AM" ? "selected" : ""}>9:00 AM</option>
              <option ${formValues.time === "10:00 AM" ? "selected" : ""}>10:00 AM</option>
              <option ${formValues.time === "11:00 AM" ? "selected" : ""}>11:00 AM</option>
              <option ${formValues.time === "2:00 PM" ? "selected" : ""}>2:00 PM</option>
              <option ${formValues.time === "3:00 PM" ? "selected" : ""}>3:00 PM</option>
            </select>
          </div>
          <div class="field" style="grid-column:1/-1"><label>Reason for Visit</label><textarea class="textarea" id="reasonInput" rows="3" placeholder="Describe your symptoms or reason for visit">${escapeHtml(formValues.reason)}</textarea></div>
        </div>
        <p><button class="button" id="confirmBooking" ${isSaving ? "disabled" : ""}>${isSaving ? "Saving..." : editingAppointmentId ? "Save Changes" : "Confirm Booking"}</button> <button class="button secondary" id="bookingCancel">Cancel</button></p>
      </div>
      <h2>Upcoming Appointments</h2>
      <div style="margin-bottom:32px">${upcoming.length ? `<div class="grid grid-2">${upcoming.map(appointmentCard).join("")}</div>` : emptyAppointmentState("No Upcoming Appointments", "You do not have any upcoming appointments yet. Once you book one, it will appear here.")}</div>
      <h2>Past Appointments</h2>
      <div>${past.length ? `<div class="card list-divider">${past.map((apt) => `<div class="list-item row between"><div class="row"><span class="icon-box">${HMS.icon("user")}</span><div><strong>${escapeHtml(apt.doctor || "-")}</strong><p class="small muted">${escapeHtml(apt.specialty || "-")}</p><p class="small muted">${escapeHtml(apt.reason || "No visit reason added.")}</p></div></div><div style="text-align:right"><p>${escapeHtml(apt.date || "-")}</p><p class="small muted">${escapeHtml(apt.time || "-")}</p><p><span class="badge ${statusBadgeClass(apt.displayStatus)}">${escapeHtml(apt.displayStatus)}</span></p></div></div>`).join("")}</div>` : emptyAppointmentState("No Past Appointments", "Completed or previous appointments will show up here after your first confirmed visit.")}</div>
    </section>
  `);
  document.getElementById("bookingToggle").addEventListener("click", () => {
    bookingOpen = !bookingOpen;
    if (!bookingOpen) {
      resetFormValues();
      statusMessage = "";
      statusType = "";
    }
    renderAppointments(currentAppointments);
  });
  document.getElementById("bookingCancel")?.addEventListener("click", () => {
    bookingOpen = false;
    resetFormValues();
    statusMessage = "";
    statusType = "";
    renderAppointments(currentAppointments);
  });
  document.getElementById("confirmBooking")?.addEventListener("click", async () => {
    updateFormValuesFromDom();
    const { specialty, doctor, date, time } = formValues;
    const reason = formValues.reason.trim();

    if (!date || !reason) {
      statusMessage = "Please fill in the appointment date and reason for visit.";
      statusType = "error";
      renderAppointments(appointments);
      return;
    }

    isSaving = true;
    statusMessage = "";
    statusType = "";
    renderAppointments(appointments);

    try {
      const isReschedule = Boolean(editingAppointmentId);
      if (editingAppointmentId) {
        await updateDoc(doc(db, "appointments", editingAppointmentId), {
          specialty,
          doctor,
          date,
          time,
          reason,
          status: "Upcoming",
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, "appointments"), {
          patientUserId: user.id,
          patientName: user.name,
          patientEmail: user.email,
          specialty,
          doctor,
          date,
          time,
          reason,
          status: "Upcoming",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      const refreshedAppointments = await fetchAppointments();
      bookingOpen = false;
      isSaving = false;
      resetFormValues();
      statusMessage = isReschedule ? "Appointment rescheduled successfully." : "Appointment booked successfully.";
      statusType = "success";
      renderAppointments(refreshedAppointments);
    } catch (error) {
      isSaving = false;
      statusMessage = error.message || `Unable to ${editingAppointmentId ? "reschedule" : "book"} the appointment right now.`;
      statusType = "error";
      renderAppointments(appointments);
    }
  });

  document.querySelectorAll(".reschedule-appointment").forEach((button) => {
    button.addEventListener("click", () => {
      const appointment = currentAppointments.find((item) => item.id === button.dataset.id);
      if (!appointment) return;
      editingAppointmentId = appointment.id;
      bookingOpen = true;
      statusMessage = "";
      statusType = "";
      formValues = {
        specialty: appointment.specialty || "General Physician",
        doctor: appointment.doctor || "Dr. Sarah Johnson",
        date: appointment.date || "",
        time: appointment.time || "9:00 AM",
        reason: appointment.reason || ""
      };
      renderAppointments(currentAppointments);
    });
  });

  document.querySelectorAll(".cancel-appointment").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!confirm("Are you sure you want to cancel this appointment?")) return;

      isSaving = true;
      statusMessage = "";
      statusType = "";
      renderAppointments(currentAppointments);

      try {
        await updateDoc(doc(db, "appointments", button.dataset.id), {
          status: "Cancelled",
          updatedAt: serverTimestamp()
        });
        const refreshedAppointments = await fetchAppointments();
        isSaving = false;
        statusMessage = "Appointment cancelled successfully.";
        statusType = "success";
        renderAppointments(refreshedAppointments);
      } catch (error) {
        isSaving = false;
        statusMessage = error.message || "Unable to cancel the appointment right now.";
        statusType = "error";
        renderAppointments(currentAppointments);
      }
    });
  });
}

if (user) {
  try {
    const appointments = await fetchAppointments();
    renderAppointments(appointments);
  } catch {
    statusMessage = "Unable to load appointments right now.";
    statusType = "error";
    renderAppointments([]);
  }
}
