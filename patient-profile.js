const user = HMS.protect("patient");

if (user) {
  const profile = {
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "March 15, 1982",
    gender: "Male",
    bloodType: "O+",
    address: "123 Main Street, New York, NY 10001",
    emergencyContact: "Jane Doe - +1 (555) 987-6543"
  };
  const items = [
    ["mail", "Email", profile.email],
    ["phone", "Phone", profile.phone],
    ["calendar", "Date of Birth", profile.dateOfBirth],
    ["user", "Gender", profile.gender],
    ["heart", "Blood Type", profile.bloodType],
    ["pin", "Address", profile.address]
  ];

  HMS.renderShell("patient-profile.html", `
    <section class="page">
      <div class="page-header"><h1 class="page-title">My Profile</h1></div>
      <div class="grid profile-grid">
        <article class="card pad">
          <div style="display:grid;justify-items:center">
            <div class="avatar">${HMS.initials(profile.name)}</div>
            <h2>${profile.name}</h2>
            <p class="muted">Patient ID: P001</p>
          </div>
        </article>
        <article class="card pad">
          <h3>Personal Information</h3>
          <div class="grid grid-2">${items.map((item) => HMS.infoItem(...item)).join("")}</div>
        </article>
        <article class="card pad" style="grid-column:1/-1"><h3>Emergency Contact</h3><p>${profile.emergencyContact}</p></article>
        <article class="card pad" style="grid-column:1/-1">
          <h3>Medical Information</h3>
          <div class="grid grid-3">
            <div class="info-block"><p class="label">Allergies</p><p class="value">Penicillin, Peanuts</p></div>
            <div class="info-block"><p class="label">Current Medications</p><p class="value">Metformin 500mg</p></div>
            <div class="info-block"><p class="label">Chronic Conditions</p><p class="value">Type 2 Diabetes</p></div>
          </div>
        </article>
      </div>
    </section>
  `);
}
