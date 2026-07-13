import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, BarChart3, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 text-white p-5 shadow">
        <h1 className="text-2xl font-bold">Faculty Dashboard</h1>
        <p>Welcome to UniSmart Faculty Portal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">

        <div
          onClick={() => navigate("/faculty/calendar")}
          className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg"
        >
          <Calendar className="h-10 w-10 text-blue-600 mb-3" />
          <h2 className="text-lg font-bold">Attendance</h2>
          <p>Mark and manage attendance.</p>
        </div>

        <div
          onClick={() => navigate("/faculty/insights")}
          className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg"
        >
          <BarChart3 className="h-10 w-10 text-green-600 mb-3" />
          <h2 className="text-lg font-bold">AI Insights</h2>
          <p>View attendance predictions.</p>
        </div>

        <div
          onClick={handleLogout}
          className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg"
        >
          <LogOut className="h-10 w-10 text-red-600 mb-3" />
          <h2 className="text-lg font-bold">Logout</h2>
          <p>Exit the Faculty Portal.</p>
        </div>

      </div>
    </div>
  );
}