const user = HMS.protect("staff");
const patientId = new URLSearchParams(window.location.search).get("id") || "P001";
let editingRecordId = null;
let records = JSON.parse(localStorage.getItem("hms-staff-records") || "null") || HMS_DATA.staffRecords;

function saveRecords() {
  localStorage.setItem("hms-staff-records", JSON.stringify(records));
}

function recordBlock(record) {
  if (editingRecordId === record.id) {
    return `
      <form class="card pad record-entry" data-record-form="${record.id}">
        <div class="grid grid-2">
          <div class="field"><label>Date</label><input class="input" name="date" type="date" value="${record.date}"></div>
          <div class="field"><label>Type</label><input class="input" name="type" value="${record.type}"></div>
        </div>
        <div class="field"><label>Diagnosis</label><input class="input" name="diagnosis" value="${record.diagnosis}"></div>
        <div class="field"><label>Treatment</label><input class="input" name="treatment" value="${record.treatment}"></div>
        <div class="field"><label>Notes</label><textarea class="textarea" name="notes" rows="3">${record.notes}</textarea></div>
        <button class="button" type="submit">Save Changes</button>
        <button class="button secondary" type="button" id="cancelEdit">Cancel</button>
      </form>
    `;
  }
  return `
    <div class="card pad record-entry">
      <div class="row between start">
        <div><p><span class="badge square blue">${record.type}</span> <span class="small muted">${record.date}</span></p><p class="small muted">Provider: ${record.provider}</p></div>
        <div><button class="button secondary edit-record" data-record-id="${record.id}">Edit</button> <button class="button danger delete-record" data-record-id="${record.id}">Delete</button></div>
      </div>
      <p><strong>Diagnosis:</strong><br>${record.diagnosis}</p>
      <p><strong>Treatment:</strong><br>${record.treatment}</p>
      <p><strong>Notes:</strong><br>${record.notes}</p>
    </div>
  `;
}

function renderPatientDetails() {
  const patient = HMS_DATA.patients.find((item) => item.id === patientId);
  if (!patient) {
    HMS.renderShell("staff-patient-list.html", `<section class="page"><h1>Patient not found</h1><p><a class="link" href="staff-patient-list.html">Back to Patient List</a></p></section>`);
    return;
  }

  HMS.renderShell("staff-patient-list.html", `
    <section class="page">
      <div class="page-header"><h1 class="page-title">Patient Details</h1></div>
      <div class="grid details-grid">
        <article class="card pad">
          <div style="display:grid;justify-items:center">
            <div class="avatar">${HMS.initials(patient.name)}</div>
            <h2>${patient.name}</h2>
            <p class="muted">Patient ID: ${patient.id}</p>
            <span class="badge ${HMS.riskClass(patient.riskLevel)}">${patient.riskLevel.toUpperCase()} RISK</span>
          </div>
        </article>
        <article class="card pad">
          <h3>Basic Information</h3>
          <div class="grid grid-2">
            ${[["user", "Age", `${patient.age} years`], ["user", "Gender", patient.gender], ["heart", "Blood Type", "O+"], ["calendar", "Last Visit", patient.lastVisit]].map((item) => HMS.infoItem(...item)).join("")}
          </div>
        </article>
      </div>
      <div class="grid grid-2" style="margin-bottom:32px">
        <article class="card pad">
          <h3 class="section-title">${HMS.icon("activity")} Health Metrics</h3>
          ${["Blood Pressure|125/82 mmHg", "Heart Rate|75 bpm", "Blood Glucose|130 mg/dL", "BMI|26.8"].map((metric) => {
            const [label, value] = metric.split("|");
            return `<div class="soft-panel row between" style="margin-top:12px"><span>${label}</span><strong>${value}</strong></div>`;
          }).join("")}
        </article>
        <article class="card pad">
          <h3 class="section-title">${HMS.icon("file")} Medical Conditions</h3>
          <div class="amber-panel" style="padding:16px;border-radius:8px"><strong>${patient.condition}</strong><p class="small muted">Primary condition under management</p></div>
          <div class="blue-panel" style="padding:16px;border-radius:8px;margin-top:12px"><strong>Hypertension</strong><p class="small muted">Controlled with medication</p></div>
          <div class="soft-panel" style="margin-top:12px"><strong class="small">Current Medications</strong><p class="small muted">Metformin 500mg - Twice daily<br>Lisinopril 10mg - Once daily</p></div>
        </article>
      </div>
      <article class="card pad">
        <div class="row between"><h3>Medical Record Entries</h3><button class="button">+ Add Record</button></div>
        <div>${records.map(recordBlock).join("")}</div>
      </article>
    </section>
  `);

  document.querySelectorAll(".edit-record").forEach((button) => {
    button.addEventListener("click", () => {
      editingRecordId = button.dataset.recordId;
      renderPatientDetails();
    });
  });
  document.querySelectorAll(".delete-record").forEach((button) => {
    button.addEventListener("click", () => {
      if (!confirm("Are you sure you want to delete this medical record?")) return;
      records = records.filter((record) => record.id !== button.dataset.recordId);
      saveRecords();
      renderPatientDetails();
    });
  });
  document.querySelectorAll("[data-record-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      records = records.map((record) => record.id === form.dataset.recordForm ? {
        ...record,
        date: data.get("date"),
        type: data.get("type"),
        diagnosis: data.get("diagnosis"),
        treatment: data.get("treatment"),
        notes: data.get("notes")
      } : record);
      editingRecordId = null;
      saveRecords();
      renderPatientDetails();
    });
  });
  document.getElementById("cancelEdit")?.addEventListener("click", () => {
    editingRecordId = null;
    renderPatientDetails();
  });
}

if (user) renderPatientDetails();
