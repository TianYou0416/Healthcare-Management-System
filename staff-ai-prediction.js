import { db } from "./firebase-config.js";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const API_BASE_URL = "http://127.0.0.1:5000";
const user = HMS.protect("staff");

let selectedPatientId = "";
let prediction = null;
let generating = false;
let saving = false;
let loadError = "";
let saveMessage = "";
let allPatients = [];
let featureSchema = [];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function displayValue(value) {
  const safeValue = String(value ?? "").trim();
  return safeValue || "-";
}

function riskBadgeClass(level) {
  return HMS.riskClass(String(level || "").toLowerCase());
}

async function fetchPatients() {
  const [usersSnapshot, patientsSnapshot] = await Promise.all([
    getDocs(query(collection(db, "users"), where("role", "==", "patient"))),
    getDocs(collection(db, "patients"))
  ]);

  const patientProfiles = new Map();
  patientsSnapshot.forEach((documentSnapshot) => {
    patientProfiles.set(documentSnapshot.id, documentSnapshot.data());
  });

  return usersSnapshot.docs.map((documentSnapshot) => {
    const account = documentSnapshot.data();
    const profile = patientProfiles.get(documentSnapshot.id) || {};
    return {
      uid: documentSnapshot.id,
      patientId: profile.patientId || `P-${documentSnapshot.id.slice(0, 6).toUpperCase()}`,
      name: profile.name || account.name || "Patient",
      email: profile.email || account.email || "",
      gender: profile.gender || "",
      chronicConditions: profile.chronicConditions || ""
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
}

async function fetchFeatureSchema() {
  const response = await fetch(`${API_BASE_URL}/features`);
  if (!response.ok) throw new Error("Unable to load model input fields. Make sure Flask API is running.");
  const data = await response.json();
  return data.features || [];
}

function selectedPatient() {
  return allPatients.find((patient) => patient.uid === selectedPatientId);
}

function featureInput(feature) {
  const options = Array.isArray(feature.options) ? feature.options : [];
  const optionItems = options.map((option) => `
    <option value="${escapeHtml(option.value)}">${escapeHtml(option.label || option.value)}</option>
  `).join("");

  return `
    <div class="field ai-feature-field">
      <label for="${escapeHtml(feature.feature)}">${escapeHtml(feature.label)}</label>
      <p class="small muted">${escapeHtml(feature.description)}</p>
      <select class="select ai-feature-input" id="${escapeHtml(feature.feature)}" name="${escapeHtml(feature.feature)}" required>
        <option value="">Select ${escapeHtml(feature.label)}</option>
        ${optionItems}
      </select>
    </div>
  `;
}

function featureForm() {
  if (!featureSchema.length) {
    return `
      <div class="empty-state">
        <span class="icon-box">${HMS.icon("brain")}</span>
        <h3>Model Fields Not Loaded</h3>
        <p class="muted empty-state-copy">Start the Flask API, then refresh this page.</p>
      </div>
    `;
  }

  return `
    <form id="predictionForm" class="prediction-form">
      <div class="grid grid-2">
        ${featureSchema.map(featureInput).join("")}
      </div>
      <button class="button" type="submit" ${!selectedPatientId || generating ? "disabled" : ""} style="margin-top:24px">
        ${generating ? `<span class="spinner"></span> Running AI Prediction Model...` : `${HMS.icon("brain")} Run AI Prediction`}
      </button>
    </form>
  `;
}

function topFactorCard(factor) {
  return `
    <div class="card pad factor-card">
      <div class="row between start">
        <div>
          <strong>${escapeHtml(factor.label)}</strong>
          <p class="small muted">${escapeHtml(factor.value)}</p>
        </div>
        <span class="badge blue">${escapeHtml(factor.impact_percentage)}%</span>
      </div>
      <div class="row">
        <div class="progress gray" style="flex:1"><span style="width:${Number(factor.impact_percentage) || 0}%"></span></div>
        <strong class="small">${escapeHtml(factor.feature)}</strong>
      </div>
    </div>
  `;
}

function predictionResult(result) {
  const patient = selectedPatient();
  return `
    <div class="grid prediction-result">
      ${saveMessage ? `<p class="profile-status success">${escapeHtml(saveMessage)}</p>` : ""}
      <section class="gradient-panel">
        <div class="row start">
          <span class="icon-box" style="background:rgba(255,255,255,.2);color:#fff">${HMS.icon("chart")}</span>
          <div>
            <h2>AI Prediction Result</h2>
            <p class="muted">${escapeHtml(patient?.patientId || "-")} - ${escapeHtml(patient?.name || "Selected Patient")}</p>
          </div>
        </div>
        <div class="grid grid-3">
          <div>
            <p class="muted">Prolonged LOS</p>
            <span class="badge ${result.prolonged_los === "Yes" ? "red" : "green"}" style="font-size:18px">${escapeHtml(result.prolonged_los)}</span>
          </div>
          <div>
            <p class="muted">Risk Level</p>
            <span class="badge ${riskBadgeClass(result.risk_level)}" style="font-size:18px">${escapeHtml(result.risk_level)}</span>
          </div>
          <div>
            <p class="muted">Probability</p>
            <div class="row">
              <div class="progress" style="flex:1"><span style="width:${Math.round(result.probability * 100)}%"></span></div>
              <strong>${Math.round(result.probability * 100)}%</strong>
            </div>
          </div>
        </div>
      </section>

      <section class="card pad">
        <h3 class="section-title">${HMS.icon("brain")} Explainable AI Output</h3>
        ${result.top_factors.map(topFactorCard).join("")}
        <div class="soft-panel" style="margin-top:16px">
          <div class="grid grid-4 small">
            <div><span class="muted">Model Type</span><p><strong>LightGBM</strong></p></div>
            <div><span class="muted">Dataset</span><p><strong>SPARCS 2024</strong></p></div>
            <div><span class="muted">Decision Threshold</span><p><strong>${escapeHtml(result.threshold)}</strong></p></div>
            <div><span class="muted">Output</span><p><strong>Prolonged LOS</strong></p></div>
          </div>
        </div>
      </section>

      <section class="card pad">
        <h3>Detailed Prediction Explanation</h3>
        <div class="soft-panel">
          <p>The model predicts a ${escapeHtml(result.risk_level.toLowerCase())} risk level with ${Math.round(result.probability * 100)}% probability for prolonged length of stay. The factors below show which clinical details had the strongest influence on this prediction.</p>
        </div>
      </section>

      <section class="card pad">
        <h3>Clinical Recommendations</h3>
        ${result.clinical_recommendations.map((text) => `
          <div class="blue-panel row start recommendation-row">
            ${HMS.icon("check")}
            <p>${escapeHtml(text)}</p>
          </div>
        `).join("")}
      </section>

      <section class="amber-panel row start prediction-warning">
        ${HMS.icon("warn")}
        <div>
          <strong>Clinical Review Required</strong>
          <p class="small">This AI-generated prediction should be reviewed by a qualified healthcare professional before making clinical decisions.</p>
        </div>
      </section>

      <div class="row prediction-actions">
        <button class="button" id="savePrediction" ${saving ? "disabled" : ""}>${saving ? "Saving..." : "Save to Patient Record"}</button>
        <button class="button secondary" id="newPrediction">Generate New Prediction</button>
      </div>
    </div>
  `;
}

function renderAiPrediction() {
  const patient = selectedPatient();

  HMS.renderShell("staff-ai-prediction.html", `
    <section class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">AI Outcome Prediction</h1>
          <p class="page-subtitle">Generate prolonged LOS predictions with LightGBM and SHAP explanations.</p>
        </div>
      </div>

      ${loadError ? `<p class="profile-status error" style="margin-bottom:16px">${escapeHtml(loadError)}</p>` : ""}

      <section class="card pad" style="margin-bottom:32px">
        <h3>Select Patient</h3>
        <div class="field">
          <label>Patient</label>
          <select class="select" id="predictionPatient">
            <option value="">Choose a patient...</option>
            ${allPatients.map((item) => `
              <option value="${escapeHtml(item.uid)}" ${item.uid === selectedPatientId ? "selected" : ""}>
                ${escapeHtml(item.patientId)} - ${escapeHtml(item.name)}
              </option>
            `).join("")}
          </select>
        </div>
        ${patient ? `
          <div class="blue-panel selected-patient-panel">
            <strong>Patient Information Retrieved:</strong>
            <div class="grid grid-3 small" style="margin-top:12px">
              <div><span class="link">Name:</span><p>${escapeHtml(patient.name)}</p></div>
              <div><span class="link">Email:</span><p>${escapeHtml(displayValue(patient.email))}</p></div>
              <div><span class="link">Conditions:</span><p>${escapeHtml(displayValue(patient.chronicConditions))}</p></div>
            </div>
          </div>
        ` : ""}
      </section>

      <section class="card pad" style="margin-bottom:32px">
        <h3>Clinical Details</h3>
        <p class="muted" style="margin-bottom:18px">Fill in the SPARCS-based clinical fields used by the trained model.</p>
        ${featureForm()}
      </section>

      ${prediction ? predictionResult(prediction) : ""}
    </section>
  `);

  document.getElementById("predictionPatient").addEventListener("change", (event) => {
    selectedPatientId = event.target.value;
    prediction = null;
    saveMessage = "";
    renderAiPrediction();
  });

  document.getElementById("predictionForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const features = {};

    featureSchema.forEach((feature) => {
      features[feature.feature] = String(formData.get(feature.feature) || "").trim();
    });

    generating = true;
    prediction = null;
    saveMessage = "";
    renderAiPrediction();

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to generate prediction.");
      prediction = {
        ...result,
        features
      };
    } catch (error) {
      loadError = error.message || "Unable to connect to the Flask prediction API.";
    } finally {
      generating = false;
      renderAiPrediction();
    }
  });

  document.getElementById("savePrediction")?.addEventListener("click", async () => {
    if (!prediction || !patient) return;
    saving = true;
    saveMessage = "";
    renderAiPrediction();

    try {
      await addDoc(collection(db, "predictions"), {
        patientUserId: patient.uid,
        userId: patient.uid,
        patientId: patient.patientId,
        patientName: patient.name,
        patientEmail: patient.email,
        staffUserId: user.id,
        staffName: user.name,
        status: "Generated",
        model: "LightGBM",
        dataset: "SPARCS 2024",
        features: prediction.features,
        prolongedLos: prediction.prolonged_los,
        riskLevel: prediction.risk_level,
        probability: prediction.probability,
        threshold: prediction.threshold,
        topFactors: prediction.top_factors,
        clinicalRecommendations: prediction.clinical_recommendations,
        createdAt: serverTimestamp()
      });
      saveMessage = "Prediction result has been saved to the patient record.";
    } catch (error) {
      loadError = error.message || "Unable to save prediction result.";
    } finally {
      saving = false;
      renderAiPrediction();
    }
  });

  document.getElementById("newPrediction")?.addEventListener("click", () => {
    prediction = null;
    saveMessage = "";
    renderAiPrediction();
  });
}

if (user) {
  try {
    [allPatients, featureSchema] = await Promise.all([
      fetchPatients(),
      fetchFeatureSchema()
    ]);
  } catch (error) {
    loadError = error.message || "Unable to load AI prediction page.";
  }
  renderAiPrediction();
}
