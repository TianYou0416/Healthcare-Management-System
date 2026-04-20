const user = HMS.protect("patient");

if (user) {
  HMS.renderShell("patient-medical-records.html", `
    <section class="page">
      <div class="page-header">
        <h1 class="page-title">Medical Records</h1>
        <button class="button">${HMS.icon("file")} Export All</button>
      </div>
      <div class="card list-divider">
        ${HMS_DATA.records.map((record) => `
          <article class="list-item">
            <div class="row start">
              <span class="icon-box">${HMS.icon("file")}</span>
              <div style="flex:1">
                <div class="row between start">
                  <div><h3>${record.type}</h3><p class="small muted">${record.doctor}</p></div>
                  <span class="small muted">${record.date}</span>
                </div>
                <div class="soft-panel record-panel"><strong class="small">Diagnosis</strong><p>${record.diagnosis}</p></div>
                <div class="soft-panel record-panel"><strong class="small">Notes</strong><p>${record.notes}</p></div>
                <p><button class="link" style="border:0;background:transparent">${HMS.icon("file")} Download Record</button></p>
              </div>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `);
}
