const user = HMS.protect("patient");

if (user) {
  const tips = [
    ["activity", "Stay Active", "Aim for at least 150 minutes of moderate aerobic activity per week."],
    ["heart", "Heart Health", "Monitor your blood pressure and cholesterol levels regularly."],
    ["chart", "Track Your Health", "Keep records of your medical history and medications."]
  ];

  HMS.renderShell("patient-health-information.html", `
    <section class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Health Information</h1>
          <p class="page-subtitle">Stay informed with the latest healthcare news and medical articles</p>
        </div>
      </div>
      <div class="grid grid-3" style="margin-bottom:32px">
        ${tips.map(([iconName, title, text]) => `
          <article class="card pad">
            <div class="row"><span class="icon-box">${HMS.icon(iconName)}</span><h3>${title}</h3></div>
            <p class="small muted">${text}</p>
          </article>
        `).join("")}
      </div>
      <section class="card">
        <div class="card-header"><h2 class="section-title">${HMS.icon("file")} Latest Health News</h2></div>
        <div class="list-divider">
          ${HMS_DATA.healthNews.map(([category, date, title, summary, source]) => `
            <article class="list-item">
              <p><span class="badge square blue">${category}</span> <span class="tiny muted">${date}</span></p>
              <h3>${title}</h3>
              <p class="muted">${summary}</p>
              <p class="small muted news-source">Source: ${source}</p>
            </article>
          `).join("")}
        </div>
      </section>
    </section>
  `);
}
