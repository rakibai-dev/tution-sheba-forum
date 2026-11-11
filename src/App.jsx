import { Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import TuitionsPage from './pages/TuitionsPage';
import TeachersPage from './pages/TeachersPage';

export default function App() {
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
