import { auth, db } from "./firebase-config.js";
import { updateEmail } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { doc, getDoc, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const user = HMS.protect("patient");
let isSaving = false;
let statusMessage = "";
let statusType = "";
let isEditing = false;
let currentProfile = null;

function buildPatientId(uid, existingValue = "") {
  if (existingValue) return existingValue;
  return `P-${uid.slice(0, 6).toUpperCase()}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function displayValue(value) {
  const safeValue = String(value || "").trim();
  return safeValue ? escapeHtml(safeValue).replaceAll("\n", "<br>") : "-";
}

function profileDefaults(baseUser, patientProfile = {}) {
  return {
    patientId: buildPatientId(baseUser.id, patientProfile.patientId),
    name: baseUser.name || "",
    email: baseUser.email || "",
    phone: patientProfile.phone || "",
    dateOfBirth: patientProfile.dateOfBirth || "",
    gender: patientProfile.gender || "",
    bloodType: patientProfile.bloodType || "",
    address: patientProfile.address || "",
    emergencyContactName: patientProfile.emergencyContactName || "",
    emergencyContactPhone: patientProfile.emergencyContactPhone || "",
    allergies: patientProfile.allergies || "",
    currentMedications: patientProfile.currentMedications || "",
    chronicConditions: patientProfile.chronicConditions || ""
  };
}

function renderProfileView(profile) {
  HMS.renderShell("patient-profile.html", `
    <section class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">My Profile</h1>
          <p class="page-subtitle">Review your personal details here. Fill in the missing fields when you are ready.</p>
        </div>
        <button class="button" id="updateProfileButton">Update Profile</button>
      </div>
      <div class="grid profile-grid">
        <article class="card pad">
          <div class="profile-sidebar">
            <div class="avatar">${HMS.initials(profile.name || "P")}</div>
            <h2>${escapeHtml(profile.name || "Patient")}</h2>
            <p class="muted">Patient ID: ${escapeHtml(profile.patientId)}</p>
          </div>
        </article>
        <article class="card pad profile-view-card">
          <h3>Personal Information</h3>
          <div class="grid grid-2 profile-display-grid">
            ${[
              ["Full Name", profile.name],
              ["Email Address", profile.email],
              ["Phone Number", profile.phone],
              ["Date of Birth", profile.dateOfBirth],
              ["Gender", profile.gender],
              ["Blood Type", profile.bloodType]
            ].map(([label, value]) => `
              <div class="profile-display-item">
                <p class="label">${label}</p>
                <p class="profile-display-value">${displayValue(value)}</p>
              </div>
            `).join("")}
          </div>
          <div class="profile-display-item">
            <p class="label">Address</p>
            <p class="profile-display-value">${displayValue(profile.address)}</p>
          </div>
        </article>
        <article class="card pad" style="grid-column:1/-1">
          <h3>Emergency Contact</h3>
          <div class="grid grid-2 profile-display-grid">
            <div class="profile-display-item">
              <p class="label">Emergency Contact Name</p>
              <p class="profile-display-value">${displayValue(profile.emergencyContactName)}</p>
            </div>
            <div class="profile-display-item">
              <p class="label">Emergency Contact Phone</p>
              <p class="profile-display-value">${displayValue(profile.emergencyContactPhone)}</p>
            </div>
          </div>
        </article>
        <article class="card pad" style="grid-column:1/-1">
          <h3>Medical Information</h3>
          <div class="grid grid-3 profile-display-grid">
            <div class="profile-display-item">
              <p class="label">Allergies</p>
              <p class="profile-display-value">${displayValue(profile.allergies)}</p>
            </div>
            <div class="profile-display-item">
              <p class="label">Current Medications</p>
              <p class="profile-display-value">${displayValue(profile.currentMedications)}</p>
            </div>
            <div class="profile-display-item">
              <p class="label">Chronic Conditions</p>
              <p class="profile-display-value">${displayValue(profile.chronicConditions)}</p>
            </div>
          </div>
        </article>
      </div>
      ${statusMessage ? `<p class="profile-status ${statusType}" style="margin-top:16px">${escapeHtml(statusMessage)}</p>` : ""}
    </section>
  `);

  document.getElementById("updateProfileButton").addEventListener("click", () => {
    isEditing = true;
    statusMessage = "";
    statusType = "";
    renderCurrentState();
  });
}

function renderProfileForm(profile) {
  HMS.renderShell("patient-profile.html", `
    <section class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Update Profile</h1>
          <p class="page-subtitle">Update your personal details and save them to your patient profile.</p>
        </div>
      </div>
      <div class="grid profile-grid">
        <article class="card pad">
          <div class="profile-sidebar">
            <div class="avatar">${HMS.initials(profile.name || "P")}</div>
            <h2>${escapeHtml(profile.name || "Patient")}</h2>
            <p class="muted">Patient ID: ${escapeHtml(profile.patientId)}</p>
          </div>
        </article>
        <article class="card pad profile-form-card">
          <h3>Personal Information</h3>
          <form class="profile-form" id="patientProfileForm">
            <div class="grid grid-2">
              <div class="field">
                <label>Full Name</label>
                <input class="input" name="name" value="${escapeHtml(profile.name)}" required>
              </div>
              <div class="field">
                <label>Email Address</label>
                <input class="input" type="email" name="email" value="${escapeHtml(profile.email)}" required>
              </div>
              <div class="field">
                <label>Phone Number</label>
                <input class="input" name="phone" value="${escapeHtml(profile.phone)}" placeholder="Enter your phone number">
              </div>
              <div class="field">
                <label>Date of Birth</label>
                <input class="input" type="date" name="dateOfBirth" value="${escapeHtml(profile.dateOfBirth)}">
              </div>
              <div class="field">
                <label>Gender</label>
                <select class="select" name="gender">
                  <option value="">Select gender</option>
                  <option value="Male" ${profile.gender === "Male" ? "selected" : ""}>Male</option>
                  <option value="Female" ${profile.gender === "Female" ? "selected" : ""}>Female</option>
                  <option value="Prefer not to say" ${profile.gender === "Prefer not to say" ? "selected" : ""}>Prefer not to say</option>
                </select>
              </div>
              <div class="field">
                <label>Blood Type</label>
                <select class="select" name="bloodType">
                  <option value="">Select blood type</option>
                  ${["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => `<option value="${type}" ${profile.bloodType === type ? "selected" : ""}>${type}</option>`).join("")}
                </select>
              </div>
            </div>

            <div class="profile-section">
              <h3 class="profile-section-title">Contact Details</h3>
              <div class="field">
                <label>Address</label>
                <textarea class="textarea" name="address" rows="3" placeholder="Enter your home address">${escapeHtml(profile.address)}</textarea>
              </div>
            </div>

            <div class="profile-section">
              <h3 class="profile-section-title">Emergency Contact</h3>
              <div class="grid grid-2">
                <div class="field">
                  <label>Emergency Contact Name</label>
                  <input class="input" name="emergencyContactName" value="${escapeHtml(profile.emergencyContactName)}" placeholder="Enter contact name">
                </div>
                <div class="field">
                  <label>Emergency Contact Phone</label>
                  <input class="input" name="emergencyContactPhone" value="${escapeHtml(profile.emergencyContactPhone)}" placeholder="Enter contact phone number">
                </div>
              </div>
            </div>

            <div class="profile-section">
              <h3 class="profile-section-title">Medical Information</h3>
              <div class="grid grid-3">
                <div class="field">
                  <label>Allergies</label>
                  <textarea class="textarea" name="allergies" rows="4" placeholder="List any allergies">${escapeHtml(profile.allergies)}</textarea>
                </div>
                <div class="field">
                  <label>Current Medications</label>
                  <textarea class="textarea" name="currentMedications" rows="4" placeholder="List any medications">${escapeHtml(profile.currentMedications)}</textarea>
                </div>
                <div class="field">
                  <label>Chronic Conditions</label>
                  <textarea class="textarea" name="chronicConditions" rows="4" placeholder="List any chronic conditions">${escapeHtml(profile.chronicConditions)}</textarea>
                </div>
              </div>
            </div>

            <div class="profile-form-actions">
              <p class="profile-status ${statusType}">${statusMessage}</p>
              <div class="profile-inline-actions">
                <button class="button secondary" type="button" id="cancelProfileEdit">Cancel</button>
                <button class="button" type="submit" ${isSaving ? "disabled" : ""}>${isSaving ? "Saving..." : "Save Profile"}</button>
              </div>
            </div>
          </form>
        </article>
      </div>
    </section>
  `);

  document.getElementById("patientProfileForm").addEventListener("submit", handleSaveProfile);
  document.getElementById("cancelProfileEdit").addEventListener("click", () => {
    isEditing = false;
    statusMessage = "";
    statusType = "";
    renderCurrentState();
  });
}

async function loadProfile() {
  const userSnapshot = await getDoc(doc(db, "users", user.id));
  const userProfile = userSnapshot.exists() ? userSnapshot.data() : {};
  const patientSnapshot = await getDoc(doc(db, "patients", user.id));
  const patientProfile = patientSnapshot.exists() ? patientSnapshot.data() : {};

  const mergedUser = {
    ...user,
    name: userProfile.name || user.name,
    email: userProfile.email || user.email
  };

  localStorage.setItem("hms-user", JSON.stringify(mergedUser));
  return profileDefaults(mergedUser, patientProfile);
}

function renderCurrentState() {
  if (!currentProfile) return;
  if (isEditing) renderProfileForm(currentProfile);
  else renderProfileView(currentProfile);
}

async function handleSaveProfile(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const updatedName = String(data.get("name") || "").trim();
  const updatedEmail = String(data.get("email") || "").trim();
  const payload = {
    userId: user.id,
    patientId: buildPatientId(user.id),
    name: updatedName,
    email: updatedEmail,
    role: "patient",
    phone: String(data.get("phone") || "").trim(),
    dateOfBirth: String(data.get("dateOfBirth") || "").trim(),
    gender: String(data.get("gender") || "").trim(),
    bloodType: String(data.get("bloodType") || "").trim(),
    address: String(data.get("address") || "").trim(),
    emergencyContactName: String(data.get("emergencyContactName") || "").trim(),
    emergencyContactPhone: String(data.get("emergencyContactPhone") || "").trim(),
    allergies: String(data.get("allergies") || "").trim(),
    currentMedications: String(data.get("currentMedications") || "").trim(),
    chronicConditions: String(data.get("chronicConditions") || "").trim(),
    updatedAt: serverTimestamp()
  };

  isSaving = true;
  statusMessage = "";
  statusType = "";
  currentProfile = { ...payload, patientId: payload.patientId };
  renderCurrentState();

  try {
    const authUser = auth.currentUser;
    if (authUser && updatedEmail && authUser.email !== updatedEmail) {
      await updateEmail(authUser, updatedEmail);
    }

    await setDoc(doc(db, "users", user.id), {
      uid: user.id,
      name: updatedName,
      email: updatedEmail,
      role: "patient",
      updatedAt: serverTimestamp()
    }, { merge: true });

    await setDoc(doc(db, "patients", user.id), payload, { merge: true });
    const updatedSessionUser = {
      ...user,
      name: updatedName,
      email: updatedEmail
    };
    localStorage.setItem("hms-user", JSON.stringify(updatedSessionUser));
    isSaving = false;
    statusMessage = "Profile saved successfully.";
    statusType = "success";
    isEditing = false;
    currentProfile = profileDefaults(updatedSessionUser, payload);
    renderCurrentState();
  } catch (error) {
    isSaving = false;
    if (error.code === "auth/requires-recent-login") {
      statusMessage = "For email changes, please log in again and try updating your profile once more.";
    } else {
      statusMessage = error.message || "Unable to save your profile right now.";
    }
    statusType = "error";
    currentProfile = profileDefaults(user, payload);
    isEditing = true;
    renderCurrentState();
  }
}

if (user) {
  try {
    currentProfile = await loadProfile();
    renderCurrentState();
  } catch (error) {
    statusMessage = error.message || "Unable to load your profile right now.";
    statusType = "error";
    currentProfile = profileDefaults(user);
    renderCurrentState();
  }
}
