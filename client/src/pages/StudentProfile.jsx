import React, { useState } from 'react';

export default function StudentProfile() {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@university.edu');

  const handleSave = (e) => {
    e.preventDefault();
    alert('Profile saved inside state configuration!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">👤 Profile Settings</h2>
        
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:outline-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:outline-indigo-500" />
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-colors shadow-sm">
            Update Profile Info
          </button>
        </form>
      </div>
    </div>
  );
}