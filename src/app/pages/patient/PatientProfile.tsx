import { User, Mail, Phone, MapPin, Calendar, Heart } from 'lucide-react';

export function PatientProfile() {
  const profileData = {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: 'March 15, 1982',
    age: 42,
    gender: 'Male',
    bloodType: 'O+',
    address: '123 Main Street, New York, NY 10001',
    emergencyContact: 'Jane Doe - +1 (555) 987-6543',
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">My Profile</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-semibold mb-4">
              {profileData.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{profileData.name}</h2>
            <p className="text-gray-600">Patient ID: P001</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{profileData.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{profileData.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-medium text-gray-900">{profileData.dateOfBirth}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="font-medium text-gray-900">{profileData.gender}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Blood Type</p>
                <p className="font-medium text-gray-900">{profileData.bloodType}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium text-gray-900">{profileData.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
          <p className="text-gray-700">{profileData.emergencyContact}</p>
        </div>

        {/* Medical Information */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Allergies</p>
              <p className="font-medium text-gray-900">Penicillin, Peanuts</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Medications</p>
              <p className="font-medium text-gray-900">Metformin 500mg</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Chronic Conditions</p>
              <p className="font-medium text-gray-900">Type 2 Diabetes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
