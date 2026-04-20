import { Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export function HealthPrediction() {
  const prediction = {
    riskLevel: 'low',
    confidence: 87,
    factors: [
      { name: 'Blood Pressure', status: 'normal', value: '120/80 mmHg' },
      { name: 'Blood Glucose', status: 'normal', value: '95 mg/dL' },
      { name: 'Cholesterol', status: 'attention', value: '210 mg/dL' },
      { name: 'BMI', status: 'normal', value: '24.5' },
    ],
    recommendations: [
      'Continue current exercise routine',
      'Monitor cholesterol levels monthly',
      'Maintain balanced diet with reduced saturated fats',
      'Schedule follow-up in 3 months',
    ],
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-amber-100 text-amber-700';
      case 'high':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'normal' ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <AlertTriangle className="w-5 h-5 text-amber-600" />
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Health Prediction</h1>

      {/* AI Prediction Summary */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">AI Health Assessment</h2>
            <p className="text-blue-100">Based on your latest health data</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-blue-100 mb-2">Overall Risk Level</p>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-lg font-semibold text-lg ${getRiskColor(prediction.riskLevel)} bg-white/90`}>
                {prediction.riskLevel.toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <p className="text-blue-100 mb-2">Prediction Confidence</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white/20 rounded-full h-3">
                <div
                  className="bg-white h-3 rounded-full"
                  style={{ width: `${prediction.confidence}%` }}
                ></div>
              </div>
              <span className="font-semibold text-lg">{prediction.confidence}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Health Factors */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Key Health Factors
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {prediction.factors.map((factor, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(factor.status)}
                <div>
                  <p className="font-medium text-gray-900">{factor.name}</p>
                  <p className="text-sm text-gray-600">{factor.value}</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  factor.status === 'normal'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {factor.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Generated Recommendations</h3>
        <div className="space-y-3">
          {prediction.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">{rec}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-900">
            <span className="font-semibold">Note:</span> These predictions are AI-generated and
            should be reviewed by a healthcare professional. Always consult with your doctor before
            making any health decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
