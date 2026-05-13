import { db } from "./firebase-config.js";
import { collection, doc, getDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const user = HMS.protect("staff");
const patientId = new URLSearchParams(window.location.search).get("id") || "";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function displayValue(value) {
  const safeValue = String(value ?? "").trim();
  return safeValue || "-";
}

function isPastDate(dateString) {
  if (!dateString) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const appointmentDate = new Date(`${dateString}T00:00:00`);
  return !Number.isNaN(appointmentDate.getTime()) && appointmentDate < today;
}

function normalizeAppointmentStatus(status) {
  const normalized = String(status || "").trim().toLowerCase();
  if (normalized === "cancelled" || normalized === "canceled") return "Cancelled";
  if (normalized === "completed" || normalized === "past") return "Completed";
  return "Upcoming";
}

async function loadPatientDetails() {
  const [userSnapshot, patientSnapshot] = await Promise.all([
    getDoc(doc(db, "users", patientId)),
    getDoc(doc(db, "patients", patientId))
  ]);

  if (!userSnapshot.exists()) return null;

  const account = userSnapshot.data();
  const profile = patientSnapshot.exists() ? patientSnapshot.data() : {};

  return {
    uid: patientId,
    patientId: profile.patientId || `P-${patientId.slice(0, 6).toUpperCase()}`,
    name: profile.name || account.name || "Patient",
    email: profile.email || account.email || "",
    phone: profile.phone || "",
    dateOfBirth: profile.dateOfBirth || "",
    gender: profile.gender || "",
    bloodType: profile.bloodType || "",
    address: profile.address || "",
    emergencyContactName: profile.emergencyContactName || "",
    emergencyContactPhone: profile.emergencyContactPhone || "",
    allergies: profile.allergies || "",
    currentMedications: profile.currentMedications || "",
    chronicConditions: profile.chronicConditions || "",
    riskLevel: profile.riskLevel || "",
    lastVisit: profile.lastVisit || ""
  };
}

async function loadUpcomingAppointments(patient) {
  const queriesToTry = [
    query(collection(db, "appointments"), where("patientUserId", "==", patient.uid)),
    query(collection(db, "appointments"), where("userId", "==", patient.uid)),
    patient.email ? query(collection(db, "appointments"), where("patientEmail", "==", patient.email)) : null
  ].filter(Boolean);

  for (const lookupQuery of queriesToTry) {
    const snapshot = await getDocs(lookupQuery);
    if (!snapshot.empty) {
      return snapshot.docs
        .map((documentSnapshot) => ({
          id: documentSnapshot.id,
          ...documentSnapshot.data()
        }))
        .filter((appointment) => normalizeAppointmentStatus(appointment.status) === "Upcoming" && !isPastDate(appointment.date))
        .sort((a, b) => `${a.date || ""} ${a.time || ""}`.localeCompare(`${b.date || ""} ${b.time || ""}`));
    }
  }

  return [];
}

function infoBlock(label, value) {
  return `<div class="profile-display-item"><p class="label">${label}</p><p class="profile-display-value">${escapeHtml(displayValue(value)).replaceAll("\n", "<br>")}</p></div>`;
}

function appointmentCard(appointment) {
  return `
    <article class="card pad">
      <div class="row between start">
        <div>
          <h3>${escapeHtml(displayValue(appointment.doctor))}</h3>
          <p class="small muted">${escapeHtml(displayValue(appointment.specialty))}</p>
        </div>
        <span class="badge blue">Upcoming</span>
      </div>
      <p class="small muted">${HMS.icon("calendar")} ${escapeHtml(displayValue(appointment.date))} &nbsp; ${escapeHtml(displayValue(appointment.time))}</p>
      <div class="soft-panel"><p class="label">Reason for Visit</p><p class="profile-display-value">${escapeHtml(displayValue(appointment.reason)).replaceAll("\n", "<br>")}</p></div>
    </article>
  `;
}

function emptyAppointmentState() {
  return `
    <div class="card">
      <div class="empty-state">
        <span class="icon-box">${HMS.icon("calendar")}</span>
        <h3>No Upcoming Appointments</h3>
        <p class="muted empty-state-copy">This patient has not booked any upcoming appointments yet.</p>
      </div>
    </div>
  `;
}

function renderPatientDetails(patient, upcomingAppointments) {
  if (!patient) {
    HMS.renderShell("staff-patient-list.html", `<section class="page"><h1>Patient not found</h1><p><a class="link" href="staff-patient-list.html">Back to Patient List</a></p></section>`);
    return;
  }

  HMS.renderShell("staff-patient-list.html", `
    <section class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Patient Details</h1>
          <p class="page-subtitle">Patient profile details from Firestore are shown below.</p>
        </div>
      </div>
      <div class="grid details-grid">
        <article class="card pad">
          <div style="display:grid;justify-items:center">
            <div class="avatar">${HMS.initials(patient.name || "P")}</div>
            <h2>${escapeHtml(patient.name)}</h2>
            <p class="muted">Patient ID: ${escapeHtml(patient.patientId)}</p>
            ${patient.riskLevel ? `<span class="badge ${HMS.riskClass(patient.riskLevel)}">${escapeHtml(patient.riskLevel.toUpperCase())} RISK</span>` : `<span class="muted">Risk Level: -</span>`}
          </div>
        </article>
        <article class="card pad">
          <h3>Basic Information</h3>
          <div class="grid grid-2">
            ${[
              ["mail", "Email", patient.email],
              ["phone", "Phone", patient.phone],
              ["calendar", "Date of Birth", patient.dateOfBirth],
              ["user", "Gender", patient.gender],
              ["heart", "Blood Type", patient.bloodType],
              ["calendar", "Last Visit", patient.lastVisit]
            ].map((item) => HMS.infoItem(item[0], item[1], displayValue(item[2]))).join("")}
          </div>
        </article>
      </div>
      <div class="grid grid-2" style="margin-bottom:32px">
        <article class="card pad">
          <h3 class="section-title">${HMS.icon("pin")} Address</h3>
          <div class="soft-panel"><p class="profile-display-value">${escapeHtml(displayValue(patient.address)).replaceAll("\n", "<br>")}</p></div>
        </article>
        <article class="card pad">
          <h3 class="section-title">${HMS.icon("users")} Emergency Contact</h3>
          <div class="grid grid-2 profile-display-grid">
            ${infoBlock("Contact Name", patient.emergencyContactName)}
            ${infoBlock("Contact Phone", patient.emergencyContactPhone)}
          </div>
        </article>
      </div>
      <article class="card pad">
        <h3>Medical Information</h3>
        <div class="grid grid-3 profile-display-grid">
          ${infoBlock("Allergies", patient.allergies)}
          ${infoBlock("Current Medications", patient.currentMedications)}
          ${infoBlock("Chronic Conditions", patient.chronicConditions)}
        </div>
      </article>
      <section style="margin-top:32px">
        <div class="row between" style="margin-bottom:16px">
          <div>
            <h2 class="section-title">${HMS.icon("calendar")} Upcoming Appointments</h2>
          </div>
        </div>
        ${upcomingAppointments.length ? `<div class="grid grid-2">${upcomingAppointments.map(appointmentCard).join("")}</div>` : emptyAppointmentState()}
      </section>
    </section>
  `);
}

if (user) {
  try {
    const patient = await loadPatientDetails();
    const upcomingAppointments = patient ? await loadUpcomingAppointments(patient) : [];
    renderPatientDetails(patient, upcomingAppointments);
  } catch (error) {
    HMS.renderShell("staff-patient-list.html", `<section class="page"><h1>Unable to load patient details</h1><p>${escapeHtml(error.message || "Please try again later.")}</p><p><a class="link" href="staff-patient-list.html">Back to Patient List</a></p></section>`);
  }
}
