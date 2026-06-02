import { db } from "./firebase-config.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const user = HMS.protect("patient");

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

function predictionTime(prediction) {
  return prediction.updatedAt?.toMillis?.() || prediction.createdAt?.toMillis?.() || 0;
}

function formatTimestamp(prediction) {
  const timestamp = prediction.updatedAt || prediction.createdAt;
  if (timestamp?.toDate) return timestamp.toDate().toLocaleString("en-SG");
  return "";
}

function riskBadgeClass(level) {
  return HMS.riskClass(String(level || "").toLowerCase());
}

async function fetchPredictionRecords() {
  const queriesToTry = [
    query(collection(db, "predictions"), where("userId", "==", user.id)),
    query(collection(db, "predictions"), where("patientUserId", "==", user.id)),
    user.email ? query(collection(db, "predictions"), where("patientEmail", "==", user.email)) : null
  ].filter(Boolean);

  const recordMap = new Map();
  const errors = [];

  for (const lookupQuery of queriesToTry) {
    try {
      const snapshot = await getDocs(lookupQuery);
      snapshot.forEach((documentSnapshot) => {
        recordMap.set(documentSnapshot.id, {
          id: documentSnapshot.id,
          ...documentSnapshot.data()
        });
      });
    } catch (error) {
      errors.push(error);
    }
  }

  if (!recordMap.size && errors.length === queriesToTry.length) {
    throw errors[0];
  }

  return Array.from(recordMap.values())
    .sort((a, b) => predictionTime(b) - predictionTime(a));
}

function factorPill(factor) {
  return `
    <div class="soft-panel medical-factor">
      <p class="label">${escapeHtml(displayValue(factor.label))}</p>
      <p class="profile-display-value">${escapeHtml(displayValue(factor.value))}</p>
      <p class="small muted">${escapeHtml(displayValue(factor.impact_percentage))}% impact</p>
    </div>
  `;
}

function recommendationItem(text) {
  return `
    <div class="blue-panel row start medical-recommendation">
      ${HMS.icon("check")}
      <p>${escapeHtml(text)}</p>
    </div>
  `;
}

function predictionRecordCard(record, index) {
  const probability = Number(record.probability || 0);
  const topFactors = Array.isArray(record.topFactors) ? record.topFactors.slice(0, 3) : [];
  const recommendations = Array.isArray(record.clinicalRecommendations) ? record.clinicalRecommendations.slice(0, 3) : [];

  return `
    <details class="card record-panel">
      <summary class="medical-record-summary">
        <div class="medical-record-summary-main">
          <p class="small muted">AI Prediction Report ${index + 1}</p>
          <h3>Prolonged Length of Stay Assessment</h3>
          <p class="small muted">Generated ${escapeHtml(formatTimestamp(record) || "-")} by ${escapeHtml(displayValue(record.staffName))}</p>
        </div>
        <div class="medical-record-summary-badges">
          <span class="badge ${record.prolongedLos === "Yes" ? "red" : "green"}">LOS: ${escapeHtml(displayValue(record.prolongedLos))}</span>
          <span class="badge ${riskBadgeClass(record.riskLevel)}">${escapeHtml(displayValue(record.riskLevel))} Risk</span>
          <span class="medical-expand-text">View Report</span>
        </div>
      </summary>

      <div class="medical-record-body">
        <div class="grid grid-4 medical-summary-grid">
          <div class="soft-panel">
            <p class="label">Prolonged LOS</p>
            <p class="profile-display-value"><span class="badge ${record.prolongedLos === "Yes" ? "red" : "green"}">${escapeHtml(displayValue(record.prolongedLos))}</span></p>
          </div>
          <div class="soft-panel">
            <p class="label">Risk Level</p>
            <p class="profile-display-value"><span class="badge ${riskBadgeClass(record.riskLevel)}">${escapeHtml(displayValue(record.riskLevel))}</span></p>
          </div>
          <div class="soft-panel">
            <p class="label">Probability</p>
            <p class="profile-display-value">${Math.round(probability * 100)}%</p>
          </div>
          <div class="soft-panel">
            <p class="label">Model</p>
            <p class="profile-display-value">${escapeHtml(displayValue(record.model))}</p>
          </div>
        </div>

        <div class="grid grid-2 medical-record-details">
          <section>
            <h4>Key Factors</h4>
            ${topFactors.length ? topFactors.map(factorPill).join("") : `<p class="muted">No key factors available.</p>`}
          </section>
          <section>
            <h4>Clinical Recommendations</h4>
            ${recommendations.length ? recommendations.map(recommendationItem).join("") : `<p class="muted">No recommendations available.</p>`}
          </section>
        </div>
      </div>
    </details>
  `;
}

function recordsView(records) {
  return `
    <section class="card pad medical-records-overview">
      <div class="row between start">
        <div>
          <h3 class="section-title">${HMS.icon("file")} AI Medical Reports</h3>
          <p class="muted">${records.length} AI-generated report${records.length === 1 ? "" : "s"} shared by your healthcare team.</p>
        </div>
        <span class="badge blue">SPARCS 2024 LOS Model</span>
      </div>
    </section>
    ${records.map(predictionRecordCard).join("")}
  `;
}

function emptyState() {
  return `
    <section class="card">
      <div class="empty-state">
        <span class="icon-box">${HMS.icon("file")}</span>
        <h3>No Medical Records Yet</h3>
        <p class="muted empty-state-copy">When your healthcare staff generates an AI prediction report or uploads a clinical record for you, it will be listed here for review.</p>
      </div>
    </section>
  `;
}

if (user) {
  let recordsMarkup = emptyState();
  let loadError = "";

  try {
    const records = await fetchPredictionRecords();
    if (records.length) recordsMarkup = recordsView(records);
  } catch (error) {
    loadError = error.message || "Unable to load medical records right now.";
  }

  HMS.renderShell("patient-medical-records.html", `
    <section class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Medical Records</h1>
          <p class="page-subtitle">AI-generated reports and clinical records shared by your healthcare team will appear here.</p>
        </div>
      </div>
      ${loadError ? `<p class="profile-status error" style="margin-bottom:16px">${escapeHtml(loadError)}</p>` : ""}
      ${recordsMarkup}
    </section>
  `);
}
