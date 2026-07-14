import React from 'react';

export default function StudentResults() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">📊 Semester Results</h2>
        
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
              <tr className="border-b">
                <th className="p-4">Subject</th>
                <th className="p-4">Internal Marks (40)</th>
                <th className="p-4">End Sem Marks (60)</th>
                <th className="p-4">Grade</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              <tr>
                <td className="p-4 font-semibold">Database Management Systems</td>
                <td className="p-4">38</td>
                <td className="p-4">54</td>
                <td className="p-4 text-indigo-600 font-bold">A+</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Data Structures & Algorithms</td>
                <td className="p-4">35</td>
                <td className="p-4">50</td>
                <td className="p-4 text-indigo-600 font-bold">A</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}