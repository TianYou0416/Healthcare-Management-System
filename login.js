let selectedRole = "patient";

function renderLogin() {
  document.getElementById("app").innerHTML = `
    <main class="auth-page">
      <section class="auth-card">
        <div class="brand">${HMS.icon("activity")}<h1>HealthCare AI</h1></div>
        <h2>Login</h2>
        <form class="form" id="loginForm">
          <div class="field">
            <label>Select Role</label>
            <div class="role-grid">
              <button class="role-button ${selectedRole === "patient" ? "active" : ""}" type="button" data-role="patient">Patient</button>
              <button class="role-button ${selectedRole === "staff" ? "active" : ""}" type="button" data-role="staff">Healthcare Staff</button>
            </div>
          </div>
          <div class="field"><label>Email Address</label><input class="input" name="email" type="email" placeholder="Enter your email" required></div>
          <div class="field"><label>Password</label><input class="input" name="password" type="password" placeholder="Enter your password" required></div>
          <button class="button" type="submit">Login</button>
        </form>
        <div class="auth-links">
          <p>Don't have an account? <a class="link" href="signup.html">Sign up</a></p>
          <p><a href="forgot-password.html">Forgot Password?</a></p>
        </div>
      </section>
    </main>
  `;
}

document.addEventListener("click", (event) => {
  const roleButton = event.target.closest("[data-role]");
  if (!roleButton) return;
  selectedRole = roleButton.dataset.role;
  renderLogin();
});

document.addEventListener("submit", (event) => {
  if (event.target.id !== "loginForm") return;
  event.preventDefault();
  const data = new FormData(event.target);
  HMS.login({
    id: "1",
    name: selectedRole === "patient" ? "John Doe" : "Dr. Sarah Johnson",
    email: data.get("email"),
    role: selectedRole
  });
});

renderLogin();
