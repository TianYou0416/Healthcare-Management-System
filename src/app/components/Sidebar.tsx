import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  User, 
  FileText, 
  Calendar, 
  Activity,
  Users,
  LayoutDashboard,
  Brain,
} from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const patientLinks = [
    { to: '/patient/home', icon: Home, label: 'Health Information' },
    { to: '/patient/profile', icon: User, label: 'Personal Profile' },
    { to: '/patient/records', icon: FileText, label: 'Medical Records' },
    { to: '/patient/appointments', icon: Calendar, label: 'Appointments' },
    { to: '/patient/prediction', icon: Activity, label: 'Health Prediction' },
  ];

  const staffLinks = [
    { to: '/staff/home', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/staff/patients', icon: Users, label: 'Patient List' },
    { to: '/staff/ai-prediction', icon: Brain, label: 'AI Outcome Prediction' },
  ];

  const links = user?.role === 'patient' ? patientLinks : staffLinks;

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-blue-600">HealthCare AI</h1>
        <p className="text-sm text-gray-500 mt-1 capitalize">{user?.role === 'staff' ? 'Staff' : user?.role} Portal</p>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}