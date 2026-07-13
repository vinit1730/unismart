import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import API from '../services/api';

export default function AiInsights() {
  const { user } = useSelector(state => state.auth);
  const [batch, setBatch] = useState('');
  const [sem, setSem] = useState('');
  const [students, setStudents] = useState([]);
  const [insights, setInsights] = useState(null);

  const lookupRoster = async () => {
    const res = await API.get(`/students?facultyId=${user.id}&batch=${batch}&semester=${sem}`);
    setStudents(res.data.data);
  };

  const getInsights = async (id) => {
    const res = await API.get(`/ai/insights/${id}`);
    setInsights(res.data.data);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 border rounded-xl space-y-3 h-fit">
          <input placeholder="Batch" value={batch} onChange={e=>setBatch(e.target.value)} className="w-full text-xs border p-2 rounded" />
          <input type="number" placeholder="Semester" value={sem} onChange={e=>setSem(e.target.value)} className="w-full text-xs border p-2 rounded" />
          <button onClick={lookupRoster} className="w-full bg-purple-600 text-white text-xs py-2 rounded">Sync Stream</button>
          
          {students.length > 0 && (
            <select onChange={e => getInsights(e.target.value)} className="w-full text-xs border p-2 rounded bg-white">
              <option value="">-- Choose Profile Target --</option>
              {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          )}
        </div>
        <div className="md:col-span-2">
          {insights ? (
            <div className="bg-white p-6 border rounded-xl shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-gray-900 border-b pb-2">{insights.studentName} Matrix Summary</h2>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-gray-50 p-3 border rounded">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Attendance</div>
                  <div className="text-xl font-black">{insights.attendancePercentage}%</div>
                </div>
                <div className="bg-gray-50 p-3 border rounded">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Consecutive Missed</div>
                  <div className="text-xl font-black">{insights.missedConsecutive}</div>
                </div>
                <div className="bg-gray-50 p-3 border rounded">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">AI Index Score</div>
                  <div className="text-xl font-black text-red-600">{insights.riskIndexPercentage}%</div>
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded border border-purple-100">
                <div className="text-xs font-bold text-purple-900 uppercase">AI Core Strategy Recommendation:</div>
                <p className="text-xs text-purple-700 mt-1 font-medium">{insights.aiRecommendation}</p>
              </div>
            </div>
          ) : <div className="bg-white p-12 text-center text-xs text-gray-400 border rounded-xl">Select active parameters parameters to parse diagnostic data streams.</div>}
        </div>
      </div>
    </div>
  );
}