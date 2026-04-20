import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye } from 'lucide-react';
import { patientsList } from '@/app/data/mockData';

export function PatientList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');

  const filteredPatients = patientsList.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'all' || patient.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const getRiskBadge = (level: string) => {
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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Patient List</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or ID..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Patient ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Age</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Gender</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Condition</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Risk Level</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Visit</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{patient.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{patient.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{patient.age}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{patient.gender}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{patient.condition}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskBadge(patient.riskLevel)}`}>
                    {patient.riskLevel}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{patient.lastVisit}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => navigate(`/staff/patients/${patient.id}`)}
                    className="flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No patients found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
