import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/app/context/AuthContext';
import { Sidebar } from '@/app/components/Sidebar';
import { Header } from '@/app/components/Header';

// Public pages
import { Login } from '@/app/pages/Login';
import { SignUp } from '@/app/pages/SignUp';
import { ForgotPassword } from '@/app/pages/ForgotPassword';

// Patient pages
import { HealthInformation } from '@/app/pages/patient/HealthInformation';
import { PatientProfile } from '@/app/pages/patient/PatientProfile';
import { MedicalRecords } from '@/app/pages/patient/MedicalRecords';
import { Appointments } from '@/app/pages/patient/Appointments';
import { HealthPrediction } from '@/app/pages/patient/HealthPrediction';

// Staff pages
import { StaffDashboard } from '@/app/pages/staff/StaffDashboard';
import { PatientList } from '@/app/pages/staff/PatientList';
import { PatientDetails } from '@/app/pages/staff/PatientDetails';
import { AIPrediction } from '@/app/pages/staff/AIPrediction';

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole: string }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={isAuthenticated ? <Navigate to={`/${user?.role}/home`} replace /> : <Login />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to={`/${user?.role}/home`} replace /> : <Login />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to={`/${user?.role}/home`} replace /> : <SignUp />} />
      <Route path="/forgot-password" element={isAuthenticated ? <Navigate to={`/${user?.role}/home`} replace /> : <ForgotPassword />} />

      {/* Patient Routes */}
      <Route
        path="/patient/home"
        element={
          <ProtectedRoute allowedRole="patient">
            <DashboardLayout>
              <HealthInformation />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/profile"
        element={
          <ProtectedRoute allowedRole="patient">
            <DashboardLayout>
              <PatientProfile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/records"
        element={
          <ProtectedRoute allowedRole="patient">
            <DashboardLayout>
              <MedicalRecords />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/appointments"
        element={
          <ProtectedRoute allowedRole="patient">
            <DashboardLayout>
              <Appointments />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/prediction"
        element={
          <ProtectedRoute allowedRole="patient">
            <DashboardLayout>
              <HealthPrediction />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Staff Routes */}
      <Route
        path="/staff/home"
        element={
          <ProtectedRoute allowedRole="staff">
            <DashboardLayout>
              <StaffDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/patients"
        element={
          <ProtectedRoute allowedRole="staff">
            <DashboardLayout>
              <PatientList />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/patients/:id"
        element={
          <ProtectedRoute allowedRole="staff">
            <DashboardLayout>
              <PatientDetails />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/ai-prediction"
        element={
          <ProtectedRoute allowedRole="staff">
            <DashboardLayout>
              <AIPrediction />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}