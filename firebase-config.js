import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAmMv5h304tlcBL9S9Nz0Urv3uVulvUvI0",
  authDomain: "healthcare-ai-management-sys.firebaseapp.com",
  projectId: "healthcare-ai-management-sys",
  storageBucket: "healthcare-ai-management-sys.firebasestorage.app",
  messagingSenderId: "302731315687",
  appId: "1:302731315687:web:1c0b4e1d65273d630fd542"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
