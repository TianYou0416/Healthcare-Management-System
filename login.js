import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { doc, getDoc, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

let selectedRole = "patient";
let isSubmitting = false;
let authResolved = false;
let message = "";
const STAFF_EMAIL = "admin@gmail.com";
const STAFF_PASSWORD = "admin123";

function renderLogin() {
  document.getElementById("app").innerHTML = `
    <main class="auth-page">
      <section class="auth-card">
        <div class="brand">${HMS.icon("activity")}<h1>HealthCare AI</h1></div>
        <h2>Login</h2>
        ${message ? `<div class="auth-message error">${message}</div>` : ""}
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
          <button class="button" type="submit" ${isSubmitting ? "disabled" : ""}>${isSubmitting ? "Signing In..." : "Login"}</button>
        </form>
        <div class="auth-links">
          <p>Don't have an account? <a class="link" href="signup.html">Sign up</a></p>
          <p><a href="forgot-password.html">Forgot Password?</a></p>
        </div>
      </section>
    </main>
  `;
}

async function loadUserProfile(userId) {
  const snapshot = await getDoc(doc(db, "users", userId));
  if (!snapshot.exists()) {
    throw new Error("Your account profile was not found. Please contact support or sign up again.");
  }
  const profile = snapshot.data();
  return {
    id: userId,
    name: profile.name || "User",
    email: profile.email || "",
    role: profile.role || "patient"
  };
}

async function ensureDefaultStaffAccount() {
  try {
    const credential = await signInWithEmailAndPassword(auth, STAFF_EMAIL, STAFF_PASSWORD);
    const existingProfile = await getDoc(doc(db, "users", credential.user.uid));
    if (!existingProfile.exists()) {
      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        name: "System Admin",
        email: STAFF_EMAIL,
        role: "staff",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
    return credential;
  } catch (error) {
    if (!["auth/invalid-credential", "auth/user-not-found"].includes(error.code)) {
      throw error;
    }
  }

  const createdCredential = await createUserWithEmailAndPassword(auth, STAFF_EMAIL, STAFF_PASSWORD);
  await setDoc(doc(db, "users", createdCredential.user.uid), {
    uid: createdCredential.user.uid,
    name: "System Admin",
    email: STAFF_EMAIL,
    role: "staff",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }, { merge: true });
  return createdCredential;
}

function getFriendlyError(error) {
  switch (error.code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid email or password.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    default:
      return error.message || "Unable to sign in right now.";
  }
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
  const email = String(data.get("email") || "").trim();
  const password = String(data.get("password") || "");

  (async () => {
    isSubmitting = true;
    message = "";
    renderLogin();
    try {
      let credential;

      if (selectedRole === "staff") {
        if (email !== STAFF_EMAIL || password !== STAFF_PASSWORD) {
          throw new Error(`Staff login is limited to the default admin account: ${STAFF_EMAIL} / ${STAFF_PASSWORD}.`);
        }
        credential = await ensureDefaultStaffAccount();
      } else {
        credential = await signInWithEmailAndPassword(auth, email, password);
      }

      const profile = await loadUserProfile(credential.user.uid);
      if (profile.role !== selectedRole) {
        await signOut(auth);
        throw new Error(`This account is registered as ${profile.role}, not ${selectedRole}.`);
      }
      HMS.login(profile);
    } catch (error) {
      isSubmitting = false;
      message = getFriendlyError(error);
      renderLogin();
    }
  })();
});

renderLogin();

onAuthStateChanged(auth, async (firebaseUser) => {
  if (authResolved) return;
  authResolved = true;
  if (!firebaseUser) return;
  try {
    const profile = await loadUserProfile(firebaseUser.uid);
    HMS.login(profile);
  } catch {
    await signOut(auth);
  }
});
