import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { User, Calendar, Activity, FileText, Heart, Edit, Trash2, Plus } from 'lucide-react';
import { patientsList } from '@/app/data/mockData';

interface MedicalRecord {
  id: string;
  date: string;
  type: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  provider: string;
}

export function PatientDetails() {
  const { id } = useParams();
  const patient = patientsList.find(p => p.id === id);
  
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([
    {
      id: 'R001',
      date: '2026-01-10',
      type: 'Follow-up Consultation',
      diagnosis: 'Type 2 Diabetes, Hypertension',
      treatment: 'Metformin 500mg, Lisinopril 10mg',
      notes: 'Patient showing good response to current treatment. Blood glucose levels improving. Continue current medication and monitor weekly.',
      provider: 'Dr. Sarah Johnson',
    },
    {
      id: 'R002',
      date: '2025-12-20',
      type: 'Lab Results Review',
      diagnosis: 'Type 2 Diabetes Management',
      treatment: 'Continue current medication',
      notes: 'Latest HbA1c: 6.8% (improved from 7.2%). Cholesterol within acceptable range. Patient advised on dietary modifications.',
      provider: 'Dr. Sarah Johnson',
    },
    {
      id: 'R003',
      date: '2025-11-15',
      type: 'Regular Check-up',
      diagnosis: 'Type 2 Diabetes, Hypertension',
      treatment: 'Medication dosage adjusted',
      notes: 'Blood pressure elevated. Increased Lisinopril to 10mg. Patient counseled on sodium reduction.',
      provider: 'Dr. Michael Chen',
    },
  ]);

  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<MedicalRecord | null>(null);

  if (!patient) {
    return <div className="p-8">Patient not found</div>;
  }

  const handleEdit = (record: MedicalRecord) => {
    setEditingRecord(record.id);
    setEditForm({ ...record });
  };

  const handleSaveEdit = () => {
    if (editForm) {
      setMedicalRecords(medicalRecords.map(r => r.id === editForm.id ? editForm : r));
      setEditingRecord(null);
      setEditForm(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
    setEditForm(null);
  };

  const handleDelete = (recordId: string) => {
    if (confirm('Are you sure you want to delete this medical record?')) {
      setMedicalRecords(medicalRecords.filter(r => r.id !== recordId));
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Patient Details</h1>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Patient Profile Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-semibold mb-4">
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 text-center">{patient.name}</h2>
            <p className="text-gray-600 mb-4">Patient ID: {patient.id}</p>
            
            <div className={`px-4 py-2 rounded-full font-medium ${
              patient.riskLevel === 'low' ? 'bg-green-100 text-green-700' :
              patient.riskLevel === 'medium' ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            }`}>
              {patient.riskLevel.toUpperCase()} RISK
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Age</p>
                <p className="font-medium text-gray-900">{patient.age} years</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="font-medium text-gray-900">{patient.gender}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Blood Type</p>
                <p className="font-medium text-gray-900">O+</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Last Visit</p>
                <p className="font-medium text-gray-900">{patient.lastVisit}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Information */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Health Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Blood Pressure</span>
              <span className="font-semibold text-gray-900">125/82 mmHg</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Heart Rate</span>
              <span className="font-semibold text-gray-900">75 bpm</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Blood Glucose</span>
              <span className="font-semibold text-gray-900">130 mg/dL</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">BMI</span>
              <span className="font-semibold text-gray-900">26.8</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Medical Conditions
          </h3>
          <div className="space-y-3">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="font-medium text-gray-900 mb-1">{patient.condition}</p>
              <p className="text-sm text-gray-600">Primary condition under management</p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-medium text-gray-900 mb-1">Hypertension</p>
              <p className="text-sm text-gray-600">Controlled with medication</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Current Medications</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Metformin 500mg - Twice daily</li>
              <li>• Lisinopril 10mg - Once daily</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Medical Records Management Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Medical Record Entries</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Add Record
          </button>
        </div>

        <div className="space-y-4">
          {medicalRecords.map((record) => (
            <div key={record.id} className="border border-gray-200 rounded-lg p-5">
              {editingRecord === record.id && editForm ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <input
                        type="text"
                        value={editForm.type}
                        onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                    <input
                      type="text"
                      value={editForm.diagnosis}
                      onChange={(e) => setEditForm({ ...editForm, diagnosis: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Treatment</label>
                    <input
                      type="text"
                      value={editForm.treatment}
                      onChange={(e) => setEditForm({ ...editForm, treatment: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      value={editForm.notes}
                      onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded">
                          {record.type}
                        </span>
                        <span className="text-sm text-gray-500">{record.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">Provider: {record.provider}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(record)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit record"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Diagnosis:</p>
                      <p className="text-gray-900">{record.diagnosis}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Treatment:</p>
                      <p className="text-gray-900">{record.treatment}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Notes:</p>
                      <p className="text-gray-900">{record.notes}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}