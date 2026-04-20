let submittedEmail = "";

function renderForgotPassword() {
  const content = submittedEmail ? `
    <main class="auth-page">
      <section class="auth-card">
        <div class="brand">${HMS.icon("activity")}<h1>HealthCare AI</h1></div>
        <div style="text-align:center">
          <div class="icon-box green success-icon">${HMS.icon("check")}</div>
          <h2>Check Your Email</h2>
          <p>We've sent a password reset link to <strong>${submittedEmail}</strong>.</p>
          <p class="small">Please check your email and click on the link to reset your password. The link will expire in 24 hours.</p>
          <p><a class="link" href="login.html">Back to Login</a></p>
          <hr style="border:0;border-top:1px solid var(--gray-200);margin:28px 0">
          <p class="small">Didn't receive the email? <button class="link" id="tryAgainButton" style="border:0;background:transparent">Try again</button></p>
        </div>
      </section>
    </main>
  ` : `
    <main class="auth-page">
      <section class="auth-card">
        <div class="brand">${HMS.icon("activity")}<h1>HealthCare AI</h1></div>
        <h2>Forgot Password?</h2>
        <p style="text-align:center">Enter your registered email address and we'll send you a link to reset your password.</p>
        <form class="form" id="forgotPasswordForm">
          <div class="field"><label>Email Address</label><input class="input" name="email" type="email" placeholder="Enter your registered email" required></div>
          <button class="button" type="submit">Send Reset Link</button>
        </form>
        <div class="auth-links">
          <p><a href="login.html">Back to Login</a></p>
          <p>Don't have an account? <a class="link" href="signup.html">Sign up</a></p>
        </div>
      </section>
    </main>
  `;
  document.getElementById("app").innerHTML = content;
}

document.addEventListener("submit", (event) => {
  if (event.target.id !== "forgotPasswordForm") return;
  event.preventDefault();
  submittedEmail = new FormData(event.target).get("email");
  renderForgotPassword();
});

document.addEventListener("click", (event) => {
  if (event.target.id !== "tryAgainButton") return;
  submittedEmail = "";
  renderForgotPassword();
});

renderForgotPassword();
