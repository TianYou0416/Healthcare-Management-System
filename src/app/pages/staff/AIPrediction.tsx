import { useState } from 'react';
import { Brain, TrendingUp, AlertCircle, CheckCircle, Loader, Save } from 'lucide-react';

const patients = [
  { id: 'P001', name: 'John Doe', age: 58, conditions: 'Hypertension, Type 2 Diabetes' },
  { id: 'P002', name: 'Jane Smith', age: 45, conditions: 'Asthma' },
  { id: 'P003', name: 'Robert Johnson', age: 62, conditions: 'Heart Disease, High Cholesterol' },
  { id: 'P004', name: 'Emily Davis', age: 51, conditions: 'Type 2 Diabetes' },
  { id: 'P005', name: 'Michael Brown', age: 67, conditions: 'COPD, Hypertension' },
];

export function AIPrediction() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [patientInfo, setPatientInfo] = useState<any>(null);

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
    const patient = patients.find(p => p.id === patientId);
    setPatientInfo(patient);
  };

  const handleGenerate = () => {
    if (!selectedPatientId) return;
    
    setIsGenerating(true);
    
    // Simulate AI prediction generation with automatic data retrieval
    setTimeout(() => {
      setPrediction({
        patientId: selectedPatientId,
        patientName: patientInfo.name,
        riskLevel: 'medium',
        riskScore: 67,
        confidence: 89,
        factors: [
          { name: 'Age', impact: 'High', value: `${patientInfo.age} years`, contribution: 25 },
          { name: 'Blood Pressure', impact: 'Medium', value: '145/90 mmHg', contribution: 18 },
          { name: 'Blood Glucose', impact: 'High', value: '165 mg/dL', contribution: 22 },
          { name: 'Family History', impact: 'Medium', value: 'Diabetes, Heart Disease', contribution: 15 },
          { name: 'BMI', impact: 'Medium', value: '28.5', contribution: 12 },
          { name: 'Physical Activity', impact: 'Low', value: 'Sedentary lifestyle', contribution: 8 },
        ],
        recommendations: [
          'Increase monitoring frequency to bi-weekly for blood glucose and blood pressure',
          'Consider adjusting medication dosage in consultation with endocrinologist',
          'Recommend enrollment in lifestyle modification program',
          'Schedule cardiology consultation within 2 weeks',
          'Initiate nutritional counseling for diabetes management',
        ],
        explanation: `Based on comprehensive analysis of 45 health indicators from the patient's medical record, including vital signs, laboratory results, medical history, and lifestyle factors, the machine learning model predicts a MEDIUM risk level for cardiovascular complications within the next 12 months. Key contributing factors include borderline stage 2 hypertension (145/90 mmHg), elevated fasting glucose levels (165 mg/dL) indicating suboptimal diabetes control, patient age (${patientInfo.age} years), and documented family history of cardiovascular disease and diabetes. The model's explainable AI analysis shows that blood glucose control contributes 22% to the overall risk score, followed by age (25%) and blood pressure (18%). The patient's sedentary lifestyle and elevated BMI further compound the risk. Early intervention through medication adjustment, lifestyle modification, and increased monitoring is strongly recommended to prevent disease progression and reduce the probability of adverse cardiovascular events.`,
        explainableAI: {
          modelType: 'Random Forest Classifier',
          dataPoints: 45,
          trainingDataset: '15,000 patient records',
          accuracy: '92.3%',
          lastTrainingDate: 'January 15, 2026',
        },
      });
      setIsGenerating(false);
    }, 2500);
  };

  const handleSaveToPrediction = () => {
    alert('Prediction result has been saved to patient medical record');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">AI Outcome Prediction</h1>
        <p className="text-gray-600">Generate AI-powered outcome predictions using pre-trained machine learning models</p>
      </div>

      {/* Patient Selection Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Patient</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Patient
          </label>
          <select
            value={selectedPatientId}
            onChange={(e) => handlePatientSelect(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a patient...</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.id} - {patient.name}
              </option>
            ))}
          </select>
        </div>

        {/* Auto-retrieved Patient Information */}
        {patientInfo && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">Patient Information Retrieved:</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-600 font-medium">Name:</span>
                <p className="text-blue-900">{patientInfo.name}</p>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Age:</span>
                <p className="text-blue-900">{patientInfo.age} years</p>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Conditions:</span>
                <p className="text-blue-900">{patientInfo.conditions}</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={!selectedPatientId || isGenerating}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Running AI Prediction Model...
            </>
          ) : (
            <>
              <Brain className="w-5 h-5" />
              Run AI Prediction
            </>
          )}
        </button>
      </div>

      {/* Prediction Results */}
      {prediction && (
        <div className="space-y-6">
          {/* Prediction Summary */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">AI Prediction Result</h2>
                <p className="text-blue-100">Patient {prediction.patientId} - {prediction.patientName}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-blue-100 mb-2 text-sm">Predicted Risk Level</p>
                <span className={`inline-block px-4 py-2 rounded-lg font-semibold text-lg ${
                  prediction.riskLevel === 'low' ? 'bg-green-500 text-white' :
                  prediction.riskLevel === 'medium' ? 'bg-amber-500 text-white' :
                  'bg-red-500 text-white'
                }`}>
                  {prediction.riskLevel.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-blue-100 mb-2 text-sm">Risk Score</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white/20 rounded-full h-3">
                    <div
                      className="bg-white h-3 rounded-full transition-all"
                      style={{ width: `${prediction.riskScore}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold text-xl">{prediction.riskScore}</span>
                </div>
              </div>
              <div>
                <p className="text-blue-100 mb-2 text-sm">Model Confidence</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white/20 rounded-full h-3">
                    <div
                      className="bg-white h-3 rounded-full transition-all"
                      style={{ width: `${prediction.confidence}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold text-xl">{prediction.confidence}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Explainable AI Output */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              Explainable AI Output
            </h3>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Contributing Factors (Feature Importance)</h4>
              <div className="space-y-3">
                {prediction.factors.map((factor: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{factor.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{factor.value}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded text-xs font-medium ${
                        factor.impact === 'High' ? 'bg-red-100 text-red-700' :
                        factor.impact === 'Medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {factor.impact} Impact
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${factor.contribution}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{factor.contribution}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Model Information</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Model Type</p>
                  <p className="font-medium text-gray-900">{prediction.explainableAI.modelType}</p>
                </div>
                <div>
                  <p className="text-gray-500">Data Points Analyzed</p>
                  <p className="font-medium text-gray-900">{prediction.explainableAI.dataPoints}</p>
                </div>
                <div>
                  <p className="text-gray-500">Model Accuracy</p>
                  <p className="font-medium text-gray-900">{prediction.explainableAI.accuracy}</p>
                </div>
                <div>
                  <p className="text-gray-500">Last Training</p>
                  <p className="font-medium text-gray-900">{prediction.explainableAI.lastTrainingDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Explanation */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Prediction Explanation</h3>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-700 leading-relaxed">{prediction.explanation}</p>
            </div>
          </div>

          {/* AI-Generated Recommendations */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinical Recommendations</h3>
            <div className="space-y-3">
              {prediction.recommendations.map((rec: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Review Notice */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-amber-900 mb-1">Clinical Review Required</p>
                <p className="text-sm text-amber-800">
                  This AI-generated prediction should be reviewed and validated by a qualified healthcare
                  professional before making any clinical decisions. The model provides supportive insights
                  but should not replace professional medical judgment.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={handleSaveToPrediction}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save to Patient Record
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Export Report
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Generate New Prediction
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
