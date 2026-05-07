const user = HMS.protect("patient");

if (user) {
  HMS.renderShell("patient-medical-records.html", `
    <section class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Medical Records</h1>
          <p class="page-subtitle">AI-generated reports and clinical records shared by your healthcare team will appear here.</p>
        </div>
      </div>
      <section class="card">
        <div class="empty-state">
          <span class="icon-box">${HMS.icon("file")}</span>
          <h3>No Medical Records Yet</h3>
          <p class="muted empty-state-copy">When your healthcare staff generates an AI prediction report or uploads a clinical record for you, it will be listed here for review and download.</p>
        </div>
      </section>
    </section>
  `);
}
