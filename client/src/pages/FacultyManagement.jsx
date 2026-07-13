import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFaculties, addFacultyRecord, purgeFacultyRecord } from '../redux/slices/facultySlice';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

export default function FacultyManagement() {
  const dispatch = useDispatch();
  const { faculties } = useSelector(state => state.faculty);
  const [form, setForm] = useState({ name: '', email: '', department: '', academicYear: '' });

  useEffect(() => { dispatch(fetchAllFaculties()); }, [dispatch]);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(addFacultyRecord(form));
    toast.success('Onboarded');
    setForm({ name: '', email: '', department: '', academicYear: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 border border-gray-200 rounded-xl h-fit">
          <h3 className="font-bold text-sm mb-3 text-gray-800">Add Faculty Profile</h3>
          <form onSubmit={onSubmit} className="space-y-3">
            <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full text-xs border p-2 rounded" required />
            <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className="w-full text-xs border p-2 rounded" required />
            <input placeholder="Dept (e.g. CSE)" value={form.department} onChange={e=>setForm({...form, department: e.target.value})} className="w-full text-xs border p-2 rounded" required />
            <input placeholder="Year" value={form.academicYear} onChange={e=>setForm({...form, academicYear: e.target.value})} className="w-full text-xs border p-2 rounded" required />
            <button className="w-full bg-blue-600 text-white text-xs py-2 rounded font-medium">Create</button>
          </form>
        </div>
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 font-bold text-gray-600">
              <tr><th className="p-3">Staff Details</th><th className="p-3">Department</th><th className="p-3 text-right">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {faculties.map(f => (
                <tr key={f._id} className="hover:bg-gray-50">
                  <td className="p-3"><div className="font-bold">{f.name}</div><div className="text-[10px] text-gray-400">{f.email}</div></td>
                  <td className="p-3 font-mono">{f.department}</td>
                  <td className="p-3 text-right"><button onClick={() => dispatch(purgeFacultyRecord(f._id))} className="text-red-500 hover:underline">Purge</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}