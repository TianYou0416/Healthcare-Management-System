const HMS_DATA = {
  healthNews: [
    ["Cardiovascular", "February 1, 2026", "New Research Shows Benefits of Regular Exercise on Heart Health", "Recent studies demonstrate that 30 minutes of daily exercise can reduce cardiovascular disease risk by up to 35%.", "Medical Journal"],
    ["Technology", "January 28, 2026", "Advances in AI-Powered Diagnostic Tools", "Machine learning algorithms are now able to detect early signs of diseases with unprecedented accuracy.", "Health Tech News"],
    ["Mental Health", "January 25, 2026", "Understanding Mental Health: Breaking the Stigma", "Mental health awareness campaigns are helping more people seek professional support for psychological well-being.", "Psychology Today"],
    ["Nutrition", "January 20, 2026", "Nutrition Guidelines Updated for 2026", "New dietary recommendations emphasize plant-based foods and reduced processed sugar intake.", "Nutrition Institute"],
    ["Telemedicine", "January 15, 2026", "Telemedicine: The Future of Healthcare Access", "Virtual consultations continue to improve healthcare accessibility for patients in remote areas.", "Healthcare Innovation"],
    ["Prevention", "January 10, 2026", "Preventive Care: Early Detection Saves Lives", "Regular health screenings and preventive check-ups are crucial for detecting conditions before they become serious.", "Public Health Journal"]
  ],
  records: [
    { id: 1, date: "2025-12-15", type: "Consultation", doctor: "Dr. Sarah Johnson", diagnosis: "Annual Check-up", notes: "Patient in good health. Blood pressure normal. Recommended annual screening." },
    { id: 2, date: "2025-09-10", type: "Lab Results", doctor: "Dr. Michael Chen", diagnosis: "Blood Test", notes: "All markers within normal range. Vitamin D slightly low - supplement recommended." },
    { id: 3, date: "2025-06-05", type: "Consultation", doctor: "Dr. Sarah Johnson", diagnosis: "Flu Symptoms", notes: "Prescribed medication. Advised rest and fluids. Follow-up if symptoms persist." }
  ],
  appointments: [
    { id: 1, date: "2026-01-20", time: "10:00 AM", doctor: "Dr. Sarah Johnson", specialty: "General Physician", type: "Check-up", status: "Upcoming" },
    { id: 2, date: "2026-02-15", time: "2:30 PM", doctor: "Dr. Michael Chen", specialty: "Cardiologist", type: "Follow-up", status: "Upcoming" },
    { id: 3, date: "2025-12-15", time: "11:00 AM", doctor: "Dr. Sarah Johnson", specialty: "General Physician", type: "Annual Check-up", status: "Completed" }
  ],
  patients: [
    { id: "P001", name: "John Doe", age: 42, gender: "Male", condition: "Diabetes", riskLevel: "medium", lastVisit: "2026-01-10" },
    { id: "P002", name: "Jane Smith", age: 35, gender: "Female", condition: "Hypertension", riskLevel: "low", lastVisit: "2026-01-12" },
    { id: "P003", name: "Robert Johnson", age: 58, gender: "Male", condition: "Heart Disease", riskLevel: "high", lastVisit: "2026-01-08" },
    { id: "P004", name: "Emily Davis", age: 29, gender: "Female", condition: "Asthma", riskLevel: "low", lastVisit: "2026-01-14" },
    { id: "P005", name: "Michael Brown", age: 65, gender: "Male", condition: "Chronic Pain", riskLevel: "medium", lastVisit: "2026-01-09" }
  ],
  predictionPatients: [
    { id: "P001", name: "John Doe", age: 58, conditions: "Hypertension, Type 2 Diabetes" },
    { id: "P002", name: "Jane Smith", age: 45, conditions: "Asthma" },
    { id: "P003", name: "Robert Johnson", age: 62, conditions: "Heart Disease, High Cholesterol" },
    { id: "P004", name: "Emily Davis", age: 51, conditions: "Type 2 Diabetes" },
    { id: "P005", name: "Michael Brown", age: 67, conditions: "COPD, Hypertension" }
  ],
  staffRecords: [
    { id: "R001", date: "2026-01-10", type: "Follow-up Consultation", diagnosis: "Type 2 Diabetes, Hypertension", treatment: "Metformin 500mg, Lisinopril 10mg", notes: "Patient showing good response to current treatment. Blood glucose levels improving. Continue current medication and monitor weekly.", provider: "Dr. Sarah Johnson" },
    { id: "R002", date: "2025-12-20", type: "Lab Results Review", diagnosis: "Type 2 Diabetes Management", treatment: "Continue current medication", notes: "Latest HbA1c: 6.8% (improved from 7.2%). Cholesterol within acceptable range. Patient advised on dietary modifications.", provider: "Dr. Sarah Johnson" },
    { id: "R003", date: "2025-11-15", type: "Regular Check-up", diagnosis: "Type 2 Diabetes, Hypertension", treatment: "Medication dosage adjusted", notes: "Blood pressure elevated. Increased Lisinopril to 10mg. Patient counseled on sodium reduction.", provider: "Dr. Michael Chen" }
  ]
};
