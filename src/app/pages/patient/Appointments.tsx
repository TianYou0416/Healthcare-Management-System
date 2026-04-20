import { useState } from 'react';
import { Calendar, Clock, User, Plus } from 'lucide-react';
import { appointments } from '@/app/data/mockData';

export function Appointments() {
  const [showBooking, setShowBooking] = useState(false);
  const upcoming = appointments.filter(a => a.status === 'Upcoming');
  const past = appointments.filter(a => a.status === 'Completed');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Appointments</h1>
        <button
          onClick={() => setShowBooking(!showBooking)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Book Appointment
        </button>
      </div>

      {showBooking && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Book New Appointment</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>General Physician</option>
                <option>Cardiologist</option>
                <option>Dermatologist</option>
                <option>Orthopedic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>Dr. Sarah Johnson</option>
                <option>Dr. Michael Chen</option>
                <option>Dr. Emily Davis</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>9:00 AM</option>
                <option>10:00 AM</option>
                <option>11:00 AM</option>
                <option>2:00 PM</option>
                <option>3:00 PM</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
              <textarea
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe your symptoms or reason for visit"
              ></textarea>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Confirm Booking
            </button>
            <button
              onClick={() => setShowBooking(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Upcoming Appointments */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {upcoming.map((apt) => (
            <div key={apt.id} className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{apt.doctor}</h3>
                    <p className="text-sm text-gray-600">{apt.specialty}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {apt.status}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {apt.date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {apt.time}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                  Reschedule
                </button>
                <button className="flex-1 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Appointments */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Past Appointments</h2>
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
          {past.map((apt) => (
            <div key={apt.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{apt.doctor}</h3>
                    <p className="text-sm text-gray-600">{apt.specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">{apt.date}</p>
                  <p className="text-sm text-gray-500">{apt.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
