let selectedRole = "patient";

function renderSignup() {
  document.getElementById("app").innerHTML = `
    <main class="auth-page">
      <section class="auth-card signup-card">
        <div class="brand">${HMS.icon("activity")}<h1>HealthCare AI</h1></div>
        <h2>Sign Up</h2>
        <form class="form" id="signupForm">
          <div class="field">
            <label>Select Role</label>
            <div class="role-grid">
              <button class="role-button ${selectedRole === "patient" ? "active" : ""}" type="button" data-role="patient">Patient</button>
              <button class="role-button ${selectedRole === "staff" ? "active" : ""}" type="button" data-role="staff">Healthcare Staff</button>
            </div>
          </div>
          <div class="field"><label>Full Name</label><input class="input" name="name" type="text" placeholder="Enter your full name" required></div>
          <div class="field"><label>Email Address</label><input class="input" name="email" type="email" placeholder="Enter your email" required></div>
          <div class="field"><label>Password</label><input class="input" name="password" type="password" placeholder="Create a password" required></div>
          <div class="field"><label>Confirm Password</label><input class="input" name="confirmPassword" type="password" placeholder="Confirm your password" required></div>
          <button class="button" type="submit">Create Account</button>
        </form>
        <div class="auth-links"><p>Already have an account? <a class="link" href="login.html">Login</a></p></div>
      </section>
    </main>
  `;
}

document.addEventListener("click", (event) => {
  const roleButton = event.target.closest("[data-role]");
  if (!roleButton) return;
  selectedRole = roleButton.dataset.role;
  renderSignup();
});

document.addEventListener("submit", (event) => {
  if (event.target.id !== "signupForm") return;
  event.preventDefault();
  const data = new FormData(event.target);
  if (data.get("password") !== data.get("confirmPassword")) {
    alert("Passwords do not match");
    return;
  }
  HMS.login({
    id: "1",
    name: data.get("name"),
    email: data.get("email"),
    role: selectedRole
  });
});

renderSignup();
