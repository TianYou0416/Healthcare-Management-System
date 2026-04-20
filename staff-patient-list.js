const user = HMS.protect("staff");
let searchTerm = "";
let riskFilter = "all";

function renderPatientList() {
  const filteredPatients = HMS_DATA.patients.filter((patient) => {
    const search = searchTerm.toLowerCase();
    return (patient.name.toLowerCase().includes(search) || patient.id.toLowerCase().includes(search)) &&
      (riskFilter === "all" || patient.riskLevel === riskFilter);
  });

  HMS.renderShell("staff-patient-list.html", `
    <section class="page">
      <div class="page-header"><h1 class="page-title">Patient List</h1></div>
      <div class="card pad row patient-filter">
        <div class="field" style="flex:1;margin:0"><input class="input" id="patientSearch" type="text" value="${searchTerm}" placeholder="Search by name or ID..."></div>
        <select class="select" id="riskFilter" style="width:220px">
          ${["all|All Risk Levels", "low|Low Risk", "medium|Medium Risk", "high|High Risk"].map((pair) => {
            const [value, label] = pair.split("|");
            return `<option value="${value}" ${riskFilter === value ? "selected" : ""}>${label}</option>`;
          }).join("")}
        </select>
      </div>
      <div class="card table-wrap">
        <table>
          <thead><tr><th>Patient ID</th><th>Name</th><th>Age</th><th>Gender</th><th>Condition</th><th>Risk Level</th><th>Last Visit</th><th>Actions</th></tr></thead>
          <tbody>
            ${filteredPatients.map((patient) => `<tr><td><strong>${patient.id}</strong></td><td>${patient.name}</td><td>${patient.age}</td><td>${patient.gender}</td><td>${patient.condition}</td><td><span class="badge ${HMS.riskClass(patient.riskLevel)}">${patient.riskLevel}</span></td><td>${patient.lastVisit}</td><td><a class="link" href="staff-patient-details.html?id=${patient.id}">View</a></td></tr>`).join("")}
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

if (user) renderPatientList();
