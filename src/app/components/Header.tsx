import { LogOut } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

export function Header() {
  const { user, logout } = useAuth();

  const getRoleLabel = () => {
    if (user?.role === 'patient') return 'Patient Portal';
    if (user?.role === 'staff') return 'Healthcare Staff Portal';
    return '';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{getRoleLabel()}</h2>
          <p className="text-sm text-gray-500">{user?.name}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
