const user = HMS.protect("staff");

if (user) {
  const stats = [
    ["users", "124", "Total Patients", ""],
    ["calendar", "18", "Today's Appointments", "green"],
    ["activity", "42", "AI Predictions Run", ""],
    ["chart", "94.2%", "Model Accuracy", "amber"]
  ];
  const visits = [["Jan", 45], ["Feb", 52], ["Mar", 48], ["Apr", 61], ["May", 55], ["Jun", 67]];
  const activities = [
    ["Generated prediction for Patient P003", "10 minutes ago"],
    ["Updated medical records for Patient P012", "25 minutes ago"],
    ["Completed consultation with Patient P007", "1 hour ago"],
    ["Reviewed lab results for Patient P015", "2 hours ago"]
  ];

  HMS.renderShell("staff-dashboard.html", `
    <section class="page">
      <div class="page-header"><h1 class="page-title">Staff Dashboard</h1></div>
      <div class="grid grid-4" style="margin-bottom:32px">
        ${stats.map(([iconName, value, label, color]) => `<article class="card pad"><span class="icon-box ${color}">${HMS.icon(iconName)}</span><h2>${value}</h2><p class="small muted">${label}</p></article>`).join("")}
      </div>
      <div class="grid grid-2" style="margin-bottom:32px">
        <article class="card pad"><h3>Patient Visits</h3><div class="chart-bars">${visits.map(([month, count]) => `<div class="bar-item"><div class="bar" style="height:${count * 2.5}px"></div><span>${month}</span></div>`).join("")}</div></article>
        <article class="card pad"><h3>Risk Distribution</h3><div class="donut"></div><div class="row" style="justify-content:center;flex-wrap:wrap"><span>Low Risk (60%)</span><span>Medium Risk (30%)</span><span>High Risk (10%)</span></div></article>
      </div>
      <article class="card pad">
        <h3>Recent Activity</h3>
        ${activities.map(([action, time]) => `<div class="soft-panel row start" style="margin-top:12px"><span class="activity-dot"></span><div><p>${action}</p><p class="small muted">${time}</p></div></div>`).join("")}
      </article>
    </section>
  `);
}
