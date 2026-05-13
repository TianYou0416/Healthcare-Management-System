import { db } from "./firebase-config.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const user = HMS.protect("staff");
let searchTerm = "";
let riskFilter = "all";
let allPatients = [];
let loadError = "";

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

async function fetchPatients() {
  const [usersSnapshot, patientsSnapshot] = await Promise.all([
    getDocs(query(collection(db, "users"), where("role", "==", "patient"))),
    getDocs(collection(db, "patients"))
  ]);

  const patientProfiles = new Map();
  patientsSnapshot.forEach((documentSnapshot) => {
    patientProfiles.set(documentSnapshot.id, documentSnapshot.data());
  });

  return usersSnapshot.docs.map((documentSnapshot) => {
    const account = documentSnapshot.data();
    const profile = patientProfiles.get(documentSnapshot.id) || {};
    return {
      uid: documentSnapshot.id,
      patientId: profile.patientId || `P-${documentSnapshot.id.slice(0, 6).toUpperCase()}`,
      name: profile.name || account.name || "Patient",
      email: profile.email || account.email || "",
      age: profile.age || "",
      gender: profile.gender || "",
      condition: profile.chronicConditions || profile.condition || "",
      riskLevel: profile.riskLevel || "",
      lastVisit: profile.lastVisit || "",
      bloodType: profile.bloodType || "",
      phone: profile.phone || ""
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
}

function renderPatientList() {
  const filteredPatients = allPatients.filter((patient) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = patient.name.toLowerCase().includes(search) ||
      patient.patientId.toLowerCase().includes(search) ||
      patient.email.toLowerCase().includes(search);
    const matchesRisk = riskFilter === "all" || String(patient.riskLevel || "").toLowerCase() === riskFilter;
    return matchesSearch && matchesRisk;
  });

  HMS.renderShell("staff-patient-list.html", `
    <section class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Patient List</h1>
          <p class="page-subtitle">Patient accounts and submitted profile details from Firestore appear here.</p>
        </div>
      </div>
      ${loadError ? `<p class="profile-status error" style="margin-bottom:16px">${escapeHtml(loadError)}</p>` : ""}
      <div class="card pad row patient-filter">
        <div class="field" style="flex:1;margin:0"><input class="input" id="patientSearch" type="text" value="${escapeHtml(searchTerm)}" placeholder="Search by name, patient ID, or email..."></div>
        <select class="select" id="riskFilter" style="width:220px">
          ${["all|All Risk Levels", "low|Low Risk", "medium|Medium Risk", "high|High Risk"].map((pair) => {
            const [value, label] = pair.split("|");
            return `<option value="${value}" ${riskFilter === value ? "selected" : ""}>${label}</option>`;
          }).join("")}
        </select>
      </div>
      <div class="card table-wrap">
        <table>
          <thead><tr><th>Patient ID</th><th>Name</th><th>Email</th><th>Gender</th><th>Condition</th><th>Risk Level</th><th>Last Visit</th><th>Actions</th></tr></thead>
          <tbody>
            ${filteredPatients.map((patient) => `
              <tr>
                <td><strong>${escapeHtml(patient.patientId)}</strong></td>
                <td>${escapeHtml(patient.name)}</td>
                <td>${escapeHtml(displayValue(patient.email))}</td>
                <td>${escapeHtml(displayValue(patient.gender))}</td>
                <td>${escapeHtml(displayValue(patient.condition))}</td>
                <td>${patient.riskLevel ? `<span class="badge ${HMS.riskClass(patient.riskLevel)}">${escapeHtml(patient.riskLevel)}</span>` : "-"}</td>
                <td>${escapeHtml(displayValue(patient.lastVisit))}</td>
                <td><a class="link" href="staff-patient-details.html?id=${encodeURIComponent(patient.uid)}">View</a></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      ${filteredPatients.length ? "" : `<p class="muted" style="text-align:center;padding:48px">No patients found matching your criteria</p>`}
    </section>
  `);

  const searchInput = document.getElementById("patientSearch");
  searchInput.addEventListener("input", () => {
    searchTerm = searchInput.value;
    renderPatientList();
    const newInput = document.getElementById("patientSearch");
    newInput.focus();
    newInput.setSelectionRange(newInput.value.length, newInput.value.length);
  });
  document.getElementById("riskFilter").addEventListener("change", (event) => {
    riskFilter = event.target.value;
    renderPatientList();
  });
}

if (user) {
  try {
    allPatients = await fetchPatients();
  } catch (error) {
    loadError = error.message || "Unable to load patients right now.";
  }
  renderPatientList();
}
