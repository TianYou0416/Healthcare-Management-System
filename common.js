const HMS_ICONS = {
  activity: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
  home: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/></svg>',
  user: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>',
  file: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  users: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  brain: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 2a3 3 0 0 0-3 3v1a3 3 0 0 0 0 6v1a3 3 0 0 0 3 3"/><path d="M15 2a3 3 0 0 1 3 3v1a3 3 0 0 1 0 6v1a3 3 0 0 1-3 3"/><path d="M9 2v20M15 2v20"/></svg>',
  chart: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>',
  mail: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.62 2.6a2 2 0 0 1-.45 2.11L8 9.71a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.83.29 1.7.5 2.6.62A2 2 0 0 1 22 16.92z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  heart: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>',
  warn: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3z"/><path d="M12 9v4M12 17h.01"/></svg>',
  logout: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>'
};

const HMS = {
  icon(name) {
    return HMS_ICONS[name] || "";
  },
  user() {
    return JSON.parse(localStorage.getItem("hms-user") || "null");
  },
  login(user) {
    localStorage.setItem("hms-user", JSON.stringify(user));
    window.location.href = user.role === "staff" ? "staff-dashboard.html" : "patient-health-information.html";
  },
  logout() {
    localStorage.removeItem("hms-user");
    window.location.href = "logout.html";
  },
  protect(role) {
    const user = HMS.user();
    if (!user) {
      window.location.replace("login.html");
      return null;
    }
    if (role && user.role !== role) {
      window.location.replace(user.role === "staff" ? "staff-dashboard.html" : "patient-health-information.html");
      return null;
    }
    return user;
  },
  initials(name) {
    return name.split(" ").map((part) => part[0]).join("");
  },
  riskClass(level) {
    if (level === "low") return "green";
    if (level === "medium") return "amber";
    if (level === "high") return "red";
    return "blue";
  },
  infoItem(iconName, label, value) {
    return `<div class="row start">${HMS.icon(iconName)}<div class="info-block"><p class="label">${label}</p><p class="value">${value}</p></div></div>`;
  },
  selectField(label, options) {
    return `<div class="field"><label>${label}</label><select class="select">${options.map((option) => `<option>${option}</option>`).join("")}</select></div>`;
  },
  renderShell(activePage, content) {
    const user = HMS.user();
    const patientLinks = [
      ["patient-health-information.html", "home", "Health Information"],
      ["patient-profile.html", "user", "Personal Profile"],
      ["patient-medical-records.html", "file", "Medical Records"],
      ["patient-appointments.html", "calendar", "Appointments"],
      ["patient-health-prediction.html", "activity", "Health Prediction"]
    ];
    const staffLinks = [
      ["staff-dashboard.html", "chart", "Dashboard"],
      ["staff-patient-list.html", "users", "Patient List"],
      ["staff-ai-prediction.html", "brain", "AI Outcome Prediction"]
    ];
    const links = user.role === "patient" ? patientLinks : staffLinks;
    document.getElementById("app").innerHTML = `
      <div class="app-shell">
        <aside class="sidebar">
          <div class="sidebar-brand"><h1>HealthCare AI</h1><p>${user.role === "staff" ? "Staff" : user.role} Portal</p></div>
          <nav class="nav">${links.map(([href, iconName, label]) => `<a class="${activePage === href ? "active" : ""}" href="${href}">${HMS.icon(iconName)}<span>${label}</span></a>`).join("")}</nav>
          <div class="sidebar-footer"><div class="user-card"><strong>${user.name}</strong><p>${user.email}</p></div></div>
        </aside>
        <div class="main-column">
          <header class="topbar">
            <div><h2>${user.role === "patient" ? "Patient Portal" : "Healthcare Staff Portal"}</h2><p>${user.name}</p></div>
            <button class="button secondary danger" id="logoutButton">${HMS.icon("logout")} Logout</button>
          </header>
          <main class="content">${content}</main>
        </div>
      </div>
    `;
    document.getElementById("logoutButton").addEventListener("click", HMS.logout);
  }
};
