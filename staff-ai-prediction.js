const user = HMS.protect("staff");
let selectedPatientId = "";
let prediction = null;
let generating = false;

function buildPrediction(patient) {
  return {
    patientId: patient.id,
    patientName: patient.name,
    riskScore: 67,
    confidence: 89,
    factors: [
      { name: "Age", impact: "High", value: `${patient.age} years`, contribution: 25 },
      { name: "Blood Pressure", impact: "Medium", value: "145/90 mmHg", contribution: 18 },
      { name: "Blood Glucose", impact: "High", value: "165 mg/dL", contribution: 22 },
      { name: "Family History", impact: "Medium", value: "Diabetes, Heart Disease", contribution: 15 },
      { name: "BMI", impact: "Medium", value: "28.5", contribution: 12 },
      { name: "Physical Activity", impact: "Low", value: "Sedentary lifestyle", contribution: 8 }
    ],
    recommendations: [
      "Increase monitoring frequency to bi-weekly for blood glucose and blood pressure",
      "Consider adjusting medication dosage in consultation with endocrinologist",
      "Recommend enrollment in lifestyle modification program",
      "Schedule cardiology consultation within 2 weeks",
      "Initiate nutritional counseling for diabetes management"
    ],
    explanation: `Based on comprehensive analysis of 45 health indicators from the patient's medical record, the model predicts a MEDIUM risk level for cardiovascular complications within the next 12 months. Key contributing factors include borderline stage 2 hypertension, elevated fasting glucose levels, patient age (${patient.age} years), and documented family history.`
  };
}

function predictionResult(result) {
  return `
    <div class="grid">
      <section class="gradient-panel">
        <div class="row start"><span class="icon-box" style="background:rgba(255,255,255,.2);color:#fff">${HMS.icon("chart")}</span><div><h2>AI Prediction Result</h2><p class="muted">Patient ${result.patientId} - ${result.patientName}</p></div></div>
        <div class="grid grid-3">
          <div><p class="muted">Predicted Risk Level</p><span class="badge amber" style="font-size:18px">MEDIUM</span></div>
          <div><p class="muted">Risk Score</p><div class="row"><div class="progress" style="flex:1"><span style="width:${result.riskScore}%"></span></div><strong>${result.riskScore}</strong></div></div>
          <div><p class="muted">Model Confidence</p><div class="row"><div class="progress" style="flex:1"><span style="width:${result.confidence}%"></span></div><strong>${result.confidence}%</strong></div></div>
        </div>
      </section>
      <section class="card pad">
        <h3 class="section-title">${HMS.icon("brain")} Explainable AI Output</h3>
        ${result.factors.map((factor) => `<div class="card pad" style="margin-top:12px"><div class="row between"><div><strong>${factor.name}</strong><p class="small muted">${factor.value}</p></div><span class="badge ${factor.impact === "High" ? "red" : factor.impact === "Medium" ? "amber" : "green"}">${factor.impact} Impact</span></div><div class="row"><div class="progress gray" style="flex:1"><span style="width:${factor.contribution}%"></span></div><strong class="small">${factor.contribution}%</strong></div></div>`).join("")}
        <div class="soft-panel" style="margin-top:16px"><div class="grid grid-4 small"><div><span class="muted">Model Type</span><p><strong>Random Forest Classifier</strong></p></div><div><span class="muted">Data Points Analyzed</span><p><strong>45</strong></p></div><div><span class="muted">Model Accuracy</span><p><strong>92.3%</strong></p></div><div><span class="muted">Last Training</span><p><strong>January 15, 2026</strong></p></div></div></div>
      </section>
      <section class="card pad"><h3>Detailed Prediction Explanation</h3><div class="soft-panel"><p>${result.explanation}</p></div></section>
      <section class="card pad"><h3>Clinical Recommendations</h3>${result.recommendations.map((text) => `<div class="blue-panel row start" style="padding:16px;border-radius:8px;margin-top:12px">${HMS.icon("check")}<p>${text}</p></div>`).join("")}</section>
      <section class="amber-panel row start" style="padding:24px;border-radius:8px">${HMS.icon("warn")}<div><strong>Clinical Review Required</strong><p class="small">This AI-generated prediction should be reviewed and validated by a qualified healthcare professional before making any clinical decisions.</p></div></section>
      <div class="row prediction-actions"><button class="button" id="savePrediction">Save to Patient Record</button><button class="button secondary">Export Report</button><button class="button secondary" id="newPrediction">Generate New Prediction</button></div>
    </div>
  `;
}

function renderAiPrediction() {
  const selected = HMS_DATA.predictionPatients.find((patient) => patient.id === selectedPatientId);
  HMS.renderShell("staff-ai-prediction.html", `
    <section class="page">
      <div class="page-header"><div><h1 class="page-title">AI Outcome Prediction</h1><p class="page-subtitle">Generate AI-powered outcome predictions using pre-trained machine learning models</p></div></div>
      <section class="card pad" style="margin-bottom:32px">
        <h3>Select Patient</h3>
        <div class="field">
          <label>Patient</label>
          <select class="select" id="predictionPatient">
            <option value="">Choose a patient...</option>
            ${HMS_DATA.predictionPatients.map((patient) => `<option value="${patient.id}" ${selected && selected.id === patient.id ? "selected" : ""}>${patient.id} - ${patient.name}</option>`).join("")}
          </select>
        </div>
        ${selected ? `<div class="blue-panel" style="padding:16px;border-radius:8px"><strong>Patient Information Retrieved:</strong><div class="grid grid-3 small" style="margin-top:12px"><div><span class="link">Name:</span><p>${selected.name}</p></div><div><span class="link">Age:</span><p>${selected.age} years</p></div><div><span class="link">Conditions:</span><p>${selected.conditions}</p></div></div></div>` : ""}
        <button class="button" id="runPrediction" ${!selected || generating ? "disabled" : ""} style="margin-top:24px">${generating ? `<span class="spinner"></span> Running AI Prediction Model...` : `${HMS.icon("brain")} Run AI Prediction`}</button>
      </section>
      ${prediction ? predictionResult(prediction) : ""}
    </section>
  `);

  document.getElementById("predictionPatient").addEventListener("change", (event) => {
    selectedPatientId = event.target.value;
    prediction = null;
    renderAiPrediction();
  });
  document.getElementById("runPrediction").addEventListener("click", () => {
    const patient = HMS_DATA.predictionPatients.find((item) => item.id === selectedPatientId);
    if (!patient) return;
    generating = true;
    prediction = null;
    renderAiPrediction();
    setTimeout(() => {
      generating = false;
      prediction = buildPrediction(patient);
      renderAiPrediction();
    }, 1200);
  });
  document.getElementById("savePrediction")?.addEventListener("click", () => alert("Prediction result has been saved to patient medical record"));
  document.getElementById("newPrediction")?.addEventListener("click", () => {
    prediction = null;
    renderAiPrediction();
  });
}

if (user) renderAiPrediction();
