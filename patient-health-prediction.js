const user = HMS.protect("patient");

if (user) {
  const factors = [
    ["Blood Pressure", "normal", "120/80 mmHg"],
    ["Blood Glucose", "normal", "95 mg/dL"],
    ["Cholesterol", "attention", "210 mg/dL"],
    ["BMI", "normal", "24.5"]
  ];

  HMS.renderShell("patient-health-prediction.html", `
    <section class="page">
      <div class="page-header"><h1 class="page-title">Health Prediction</h1></div>
      <section class="gradient-panel" style="margin-bottom:32px">
        <div class="row start"><span class="icon-box" style="background:rgba(255,255,255,.2);color:#fff">${HMS.icon("activity")}</span><div><h2>AI Health Assessment</h2><p class="muted">Based on your latest health data</p></div></div>
        <div class="grid grid-2">
          <div><p class="muted">Overall Risk Level</p><span class="badge green" style="font-size:18px">LOW</span></div>
          <div><p class="muted">Prediction Confidence</p><div class="row"><div class="progress" style="flex:1"><span style="width:87%"></span></div><strong>87%</strong></div></div>
        </div>
      </section>
      <section class="card pad" style="margin-bottom:32px">
        <h3 class="section-title">${HMS.icon("chart")} Key Health Factors</h3>
        <div class="grid grid-2">
          ${factors.map(([name, status, value]) => `
            <div class="soft-panel row between">
              <div class="row">${HMS.icon(status === "normal" ? "check" : "warn")}<div><strong>${name}</strong><p class="small muted">${value}</p></div></div>
              <span class="badge ${status === "normal" ? "green" : "amber"}">${status}</span>
            </div>
          `).join("")}
        </div>
      </section>
      <section class="card pad">
        <h3>AI-Generated Recommendations</h3>
        ${["Continue current exercise routine", "Monitor cholesterol levels monthly", "Maintain balanced diet with reduced saturated fats", "Schedule follow-up in 3 months"].map((text) => `<div class="soft-panel blue-panel row start" style="margin-top:12px">${HMS.icon("check")}<p>${text}</p></div>`).join("")}
        <div class="amber-panel prediction-note" style="padding:16px;border-radius:8px">
          <p><strong>Note:</strong> These predictions are AI-generated and should be reviewed by a healthcare professional.</p>
        </div>
      </section>
    </section>
  `);
}
