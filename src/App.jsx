import { Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LockScreen from './components/LockScreen';
import Navbar from './components/Navbar';
import TuitionsPage from './pages/TuitionsPage';
import TeachersPage from './pages/TeachersPage';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100/60 flex flex-col items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-xs p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm font-medium text-gray-600">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LockScreen />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100/60 text-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<TuitionsPage />} />
          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Analytics />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
