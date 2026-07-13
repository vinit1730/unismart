import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import VerifyOtp from './pages/VerifyOtp';
import FacultyManagement from './pages/FacultyManagement';
import StudentUpload from './pages/StudentUpload';
import AttendanceCalendar from './pages/AttendanceCalendar';
import AiInsights from './pages/AiInsights';
import FacultyDashboard from './pages/FacultyDashboard';

// Enhanced ProtectedRoute with explicit fallback check
function ProtectedRoute({ children, role }) {
  const { user, loading } = useSelector(state => state.auth);

  // 1. Wait if your Redux state has a loading flag
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xs text-gray-500">Loading...</div>;
  }

  // 2. If no user session exists, redirect straight to landing/login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 3. If a specific role is required but user role doesn't match, send back
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<VerifyOtp />} />
          
          {/* Admin Routes */}
          <Route path="/admin/faculty" element={<ProtectedRoute role="ADMIN"><FacultyManagement /></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute role="ADMIN"><StudentUpload /></ProtectedRoute>} />

          {/* Faculty Routes */}
          <Route path="/faculty/dashboard" element={<ProtectedRoute role="FACULTY"><FacultyDashboard /></ProtectedRoute>} />
          <Route path="/faculty/calendar" element={<ProtectedRoute role="FACULTY"><AttendanceCalendar /></ProtectedRoute>} />
          <Route path="/faculty/insights" element={<ProtectedRoute role="FACULTY"><AiInsights /></ProtectedRoute>} />
          
          {/* Catch-All Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}