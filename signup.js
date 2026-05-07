import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { doc, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

let selectedRole = "patient";
let isSubmitting = false;
let message = "";
let authResolved = false;

function renderSignup() {
  document.getElementById("app").innerHTML = `
    <main class="auth-page">
      <section class="auth-card signup-card">
        <div class="brand">${HMS.icon("activity")}<h1>HealthCare AI</h1></div>
        <h2>Sign Up</h2>
        ${message ? `<div class="auth-message error">${message}</div>` : ""}
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
          <button class="button" type="submit" ${isSubmitting ? "disabled" : ""}>${isSubmitting ? "Creating Account..." : "Create Account"}</button>
        </form>
        <div class="auth-links"><p>Already have an account? <a class="link" href="login.html">Login</a></p></div>
      </section>
    </main>
  `;
}

function getFriendlyError(error) {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please log in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    default:
      return error.message || "Unable to create your account right now.";
  }
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
    message = "Passwords do not match.";
    renderSignup();
    return;
  }

  (async () => {
    isSubmitting = true;
    message = "";
    renderSignup();
    try {
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const password = String(data.get("password") || "");

      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        name,
        email,
        role: selectedRole,
        createdAt: serverTimestamp()
      });

      HMS.login({
        id: credential.user.uid,
        name,
        email,
        role: selectedRole
      });
    } catch (error) {
      isSubmitting = false;
      message = getFriendlyError(error);
      renderSignup();
    }
  })();
});

renderSignup();

onAuthStateChanged(auth, async (firebaseUser) => {
  if (authResolved) return;
  authResolved = true;
  const sessionUser = HMS.user();
  if (firebaseUser && sessionUser) HMS.login(sessionUser);
});
