import React from 'react';

export default function StudentTimetable() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">🕒 Class Timetable</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h3 className="font-bold text-indigo-900 border-b pb-2 mb-3">Monday</h3>
            <div className="bg-blue-100 text-blue-800 p-3 rounded-lg mb-2 text-xs">
              <p className="font-bold">09:00 AM - DBMS</p>
              <p className="opacity-70">Room 401</p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h3 className="font-bold text-indigo-900 border-b pb-2 mb-3">Tuesday</h3>
            <div className="bg-violet-100 text-violet-800 p-3 rounded-lg mb-2 text-xs">
              <p className="font-bold">11:00 AM - DSA</p>
              <p className="opacity-70">Room 202</p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-center">
            <p className="text-gray-400 italic text-sm">No Friday Sessions</p>
          </div>
        </div>
      </div>
    </div>
  );
}