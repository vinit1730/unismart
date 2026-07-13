import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GraduationCap, LogOut } from 'lucide-react';
import { logout } from '../redux/slices/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center font-sans">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg text-white">
          <GraduationCap className="h-5 w-5" />
        </div>
        {/* Clicking the main logo takes the user back to their dashboard */}
        <Link to={user?.role === 'ADMIN' ? '/admin/faculty' : '/faculty/calendar'} className="text-lg font-bold text-gray-900 hover:opacity-90">
          UniSmart Console
        </Link>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs font-bold text-gray-800">{user.name}</div>
            <div className="text-[10px] text-gray-400 font-mono uppercase">{user.role} Portal</div>
          </div>

          {user.role === 'ADMIN' && (
            <div className="flex gap-3 text-xs font-medium text-gray-600">
              <Link to="/admin/faculty" className="hover:text-blue-600 transition-colors">Faculty Records</Link>
              <Link to="/admin/students" className="hover:text-blue-600 transition-colors">Bulk Ingestion</Link>
            </div>
          )}

          {user.role === 'FACULTY' && (
            <div className="flex gap-3 text-xs font-medium text-gray-600">
              {/* Route updated to point cleanly to the attendance interface */}
              <Link to="/faculty/calendar" className="hover:text-blue-600 font-semibold transition-colors">
                Mark Attendance
              </Link>
              <Link to="/faculty/insights" className="hover:text-purple-600 transition-colors">
                Predictive AI
              </Link>
            </div>
          )}

          <button 
            onClick={() => { dispatch(logout()); navigate('/'); }} 
            className="text-gray-400 hover:text-red-600 transition-colors ml-1"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      )}
    </nav>
  );
}