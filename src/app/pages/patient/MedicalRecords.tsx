import { FileText, Download } from 'lucide-react';
import { patientMedicalRecords } from '@/app/data/mockData';

export function MedicalRecords() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Medical Records</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="w-4 h-4" />
          Export All
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {patientMedicalRecords.map((record) => (
            <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{record.type}</h3>
                      <p className="text-sm text-gray-600 mt-1">{record.doctor}</p>
                    </div>
                    <span className="text-sm text-gray-500">{record.date}</span>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Diagnosis</p>
                    <p className="text-gray-900">{record.diagnosis}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Notes</p>
                    <p className="text-gray-700">{record.notes}</p>
                  </div>

                  <button className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    Download Record
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
