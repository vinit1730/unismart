import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';

// Base Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import VerifyOtp from './pages/VerifyOtp';

// Faculty & Admin Components
import FacultyManagement from './pages/FacultyManagement';
import StudentUpload from './pages/StudentUpload';
import AttendanceCalendar from './pages/AttendanceCalendar';
import AiInsights from './pages/AiInsights';
import FacultyDashboard from './pages/FacultyDashboard';

// Student Portal Components
import StudentDashboard from './pages/StudentDashboard';
import StudentAttendance from './pages/StudentAttendance';
import StudentResults from './pages/StudentResults';
import StudentTimetable from './pages/StudentTimetable';
import StudentProfile from './pages/StudentProfile';
import StudentReports from './pages/StudentReports';
import StudentChatbot from './pages/StudentChatbot';
import StudentExam from './pages/StudentExam';

// Parent Components
import ParentDashboard from './pages/ParentDashboard';

// Role-Based Protection Guard
function ProtectedRoute({ children, role }) {
  const { user, loading } = useSelector(state => state.auth);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xs text-gray-500">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

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
          
{/* Student Portal Routes */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/attendance" element={<StudentAttendance />} />
          <Route path="/student/results" element={<StudentResults />} />
          <Route path="/student/timetable" element={<StudentTimetable />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/reports" element={<StudentReports />} />
          <Route path="/student/ai-chat" element={<StudentChatbot />} />
          <Route path="/student/exam" element={<StudentExam />} />
          
          {/* Parent Portal Routes */}
          <Route path="/parent/dashboard" element={<ParentDashboard />} />
          
          {/* Catch-All Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}