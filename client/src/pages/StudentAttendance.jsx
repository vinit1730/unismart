import React from 'react';

export default function StudentAttendance() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">📅 Student Attendance Tracking</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
            <p className="text-sm text-green-700 font-medium">Total Classes Held</p>
            <p className="text-2xl font-bold text-green-900">120</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
            <p className="text-sm text-blue-700 font-medium">Classes Attended</p>
            <p className="text-2xl font-bold text-blue-900">112</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-center">
            <p className="text-sm text-indigo-700 font-medium">Attendance Percentage</p>
            <p className="text-2xl font-bold text-indigo-900">93.3%</p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500 border-b">
              <tr>
                <th className="p-3">Course</th>
                <th className="p-3">Attended / Total</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              <tr>
                <td className="p-3 font-medium">Database Systems</td>
                <td className="p-3">28 / 30</td>
                <td className="p-3 text-green-600 font-bold">Good Standing</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Data Structures</td>
                <td className="p-3">26 / 30</td>
                <td className="p-3 text-green-600 font-bold">Good Standing</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}