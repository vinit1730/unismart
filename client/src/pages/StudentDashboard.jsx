import React, { useState } from 'react';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@university.edu',
    major: 'Computer Science'
  });

  const [inputName, setInputName] = useState(profile.name);
  const [inputEmail, setInputEmail] = useState(profile.email);
  const [inputMajor, setInputMajor] = useState(profile.major);

  const getInitials = (fullName) => {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfile({
      name: inputName,
      email: inputEmail,
      major: inputMajor
    });
    alert('Profile updated successfully!');
    setActiveTab('dashboard');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans text-gray-800 w-full">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col justify-between hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            {/* Graduation Cap SVG */}
            <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
            <span className="text-xl font-bold tracking-wider">EduPortal</span>
          </div>
          
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'dashboard' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('academics')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'academics' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'}`}
            >
              Academics
            </button>
            <button 
              onClick={() => setActiveTab('schedule')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'schedule' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'}`}
            >
              Schedule
            </button>
            <button 
              onClick={() => setActiveTab('profile')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'profile' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'}`}
            >
              Profile Settings
            </button>
          </nav>
        </div>

        <div className="p-6 border-t border-indigo-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white shadow-md">
              {getInitials(profile.name)}
            </div>
            <div>
              <p className="font-semibold text-sm leading-none">{profile.name}</p>
              <span className="text-xs text-indigo-300">ID: #2026094</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* HEADER */}
        <header class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm bg-green-100 text-green-800 font-semibold px-3 py-1 rounded-full">Active Term: Fall 2026</span>
          </div>
        </header>

        {/* TABS CONTAINER */}
        <div className="p-8 max-w-7xl w-full mx-auto space-y-8">

          {/* 1. DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-3xl font-bold mb-2">Welcome Back, {profile.name.split(' ')[0]}! 👋</h2>
                <p className="text-indigo-100 max-w-md">Keep up the great work. You have 2 assignments due this week and your overall GPA is looking excellent.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="p-4 bg-indigo-100 text-indigo-600 rounded-xl">🌟</div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Cumulative GPA</p>
                    <p className="text-2xl font-bold text-gray-800">3.85 / 4.00</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="p-4 bg-emerald-100 text-emerald-600 rounded-xl">📚</div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Completed Credits</p>
                    <p className="text-2xl font-bold text-gray-800">72 Credits</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="p-4 bg-amber-100 text-amber-600 rounded-xl">🕒</div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Attendance Rate</p>
                    <p className="text-2xl font-bold text-gray-800">94%</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold mb-4 text-gray-800">Recent Assignment Grades</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-3">
                      <div>
                        <p className="font-semibold text-gray-700">Database Normalization Quiz</p>
                        <span className="text-xs text-gray-400">CS 302 • Oct 12, 2026</span>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg font-bold">A (95%)</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-3">
                      <div>
                        <p className="font-semibold text-gray-700">UI Redesign Wireframe</p>
                        <span className="text-xs text-gray-400">UXD 101 • Oct 08, 2026</span>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg font-bold">A- (91%)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold mb-4 text-gray-800">Campus Announcements</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg">
                      <h4 className="font-semibold text-indigo-900">Spring Registration starts next week!</h4>
                      <p className="text-sm text-indigo-700 mt-1">Make sure to clear any holds on your account before October 22nd.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. ACADEMICS TAB */}
          {activeTab === 'academics' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Current Enrolled Courses</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-gray-400 uppercase text-xs tracking-wider border-b border-gray-200">
                      <th className="pb-3 pl-2">Course Code</th>
                      <th className="pb-3">Course Title</th>
                      <th className="pb-3">Instructor</th>
                      <th className="pb-3">Credits</th>
                      <th className="pb-3">Grade State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    <tr>
                      <td className="py-4 pl-2 font-mono font-semibold text-indigo-600">CS 302</td>
                      <td className="py-4 font-semibold text-gray-800">Database Management Systems</td>
                      <td className="py-4">Dr. Angela Yu</td>
                      <td className="py-4">4.0</td>
                      <td className="py-4"><span className="px-2.5 py-1 bg-green-100 text-green-800 rounded font-bold text-xs">95% (A)</span></td>
                    </tr>
                    <tr>
                      <td className="py-4 pl-2 font-mono font-semibold text-indigo-600">CS 201</td>
                      <td className="py-4 font-semibold text-gray-800">Data Structures & Algorithms</td>
                      <td className="py-4">Prof. Robert Sedgewick</td>
                      <td className="py-4">4.0</td>
                      <td className="py-4"><span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded font-bold text-xs">84% (B)</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. SCHEDULE TAB */}
          {activeTab === 'schedule' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Weekly Class Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-indigo-900 border-b pb-2 mb-3">Monday</h4>
                  <div className="bg-indigo-100 text-indigo-800 p-3 rounded-lg text-xs space-y-1 mb-2">
                    <p className="font-bold">CS 302 - DBMS</p>
                    <p>09:00 AM - 10:30 AM</p>
                    <p className="opacity-75">Room 401</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 class="font-bold text-indigo-900 border-b pb-2 mb-3">Tuesday</h4>
                  <div className="bg-violet-100 text-violet-800 p-3 rounded-lg text-xs space-y-1">
                    <p className="font-bold">CS 201 - DSA</p>
                    <p>11:00 AM - 12:30 PM</p>
                    <p className="opacity-75">Room 202</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-center">
                  <p className="text-gray-400 text-xs italic">No Friday Classes</p>
                </div>
              </div>
            </div>
          )}

          {/* 4. PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-2xl">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Edit Student Profile</h3>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={inputName} 
                    onChange={(e) => setInputName(e.target.value)} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={inputEmail} 
                    onChange={(e) => setInputEmail(e.target.value)} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Major</label>
                  <input 
                    type="text" 
                    value={inputMajor} 
                    onChange={(e) => setInputMajor(e.target.value)} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors shadow">
                  Save Changes
                </button>
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}