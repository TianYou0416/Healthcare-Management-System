import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

try {
  await signOut(auth);
} catch {
  // Ignore sign-out errors and continue clearing the local session.
}

localStorage.removeItem("hms-user");
window.location.replace("login.html");
