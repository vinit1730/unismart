import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import API from '../services/api';
import toast from 'react-hot-toast';

export default function AttendanceCalendar() {
  const { user } = useSelector(state => state.auth);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [batch, setBatch] = useState('');
  const [sem, setSem] = useState('');
  const [students, setStudents] = useState([]);
  const [map, setMap] = useState({});

  const loadRoster = async () => {
    if (!batch || !sem) return;
    
    try {
      // 1. Force the batch text to UPPERCASE before making the API request
      const formattedBatch = batch.toUpperCase().trim();
      
      const sRes = await API.get(`/students?facultyId=${user.id}&batch=${formattedBatch}&semester=${sem}`);
      
      if (!sRes.data.data || sRes.data.data.length === 0) {
        setStudents([]);
        return;
      }
      
      setStudents(sRes.data.data);
      
      const aRes = await API.get(`/attendance/query?facultyId=${user.id}&date=${date}&batch=${formattedBatch}&semesterNumber=${sem}`);
      const currentMap = {};
      
      sRes.data.data.forEach(s => currentMap[s._id] = 'PRESENT');
      if (aRes.data.data && aRes.data.data.records) {
        aRes.data.data.records.forEach(r => currentMap[r.studentId._id || r.studentId] = r.status);
      }
      setMap(currentMap);
      
    } catch (error) {
      console.error("Error loading roster:", error);
      toast.error("Failed to load student roster.");
    }
  };

  useEffect(() => { 
    loadRoster(); 
  }, [date, batch, sem]);

  const onCommit = async () => {
    try {
      const formattedBatch = batch.toUpperCase().trim();
      const recs = Object.keys(map).map(id => ({ studentId: id, status: map[id] }));
      await API.post('/attendance/save', { facultyId: user.id, date, batch: formattedBatch, semesterNumber: parseInt(sem), records: recs });
      toast.success('Roster records saved.');
    } catch (error) {
      console.error("Error saving records:", error);
      toast.error("Failed to save records.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 border border-gray-200 rounded-xl mb-4">
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="text-xs border p-2 rounded" />
          <input placeholder="Batch (e.g. CSE-2024)" value={batch} onChange={e=>setBatch(e.target.value)} className="text-xs border p-2 rounded" />
          <input type="number" placeholder="Semester" value={sem} onChange={e=>setSem(e.target.value)} className="text-xs border p-2 rounded" />
        </div>
        
        {/* If no students are found but filters are complete, show a helpful message */}
        {batch && sem && students.length === 0 && (
          <div className="bg-white border rounded-xl p-6 text-center text-xs text-gray-500">
            No students found for Batch "{batch.toUpperCase()}" and Semester {sem}. Please make sure students are uploaded.
          </div>
        )}

        {students.length > 0 && (
          <div className="bg-white border rounded-xl overflow-hidden shadow-xs">
            <div className="divide-y text-xs p-4 space-y-2">
              {students.map(s => (
                <div key={s._id} className="flex justify-between items-center py-2">
                  <div><span className="font-bold">{s.name}</span> <span className="text-gray-400 font-mono">({s.rollNumber})</span></div>
                  <button onClick={() => setMap({...map, [s._id]: map[s._id] === 'PRESENT' ? 'ABSENT' : 'PRESENT'})} className={`px-4 py-1 rounded-full font-bold uppercase text-[10px] ${map[s._id] === 'PRESENT' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{map[s._id]}</button>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 p-3 text-right"><button onClick={onCommit} className="bg-blue-600 text-white font-medium text-xs py-1.5 px-4 rounded">Save Roster Ledger</button></div>
          </div>
        )}
      </div>
    </div>
  );
}