import React, { useState } from 'react';

export default function ParentDashboard() {
  // Mock Student tracking profile linked to this parent account
  const studentTrack = {
    name: "John Doe",
    rollNo: "CS2026-094",
    attendance: "93.3%",
    gpa: "3.85",
    feesPaid: false,
    feeAmount: "$1,200"
  };

  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([
    { id: 1, sender: "Teacher", text: "Hello, John has performed exceptionally well in his mid-term Database quiz." }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setChatLog(prev => [...prev, { id: Date.now(), sender: "Parent", text: message.trim() }]);
    setMessage('');

    // Simulated auto acknowledgment from faculty advisor
    setTimeout(() => {
      setChatLog(prev => [...prev, { id: Date.now() + 1, sender: "Teacher", text: "Thank you for the message. I will review this and respond during office hours." }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Parent Portal Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-2xl p-8 shadow-md flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Parent Observation Control Panel 🧑‍🏫</h1>
            <p className="text-teal-100 text-sm">Monitoring Academic Progress for: <span className="underline font-semibold">{studentTrack.name}</span> ({studentTrack.rollNo})</p>
          </div>
          <span className="bg-white/20 px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider">Verified Guard Route</span>
        </div>

        {/* Quick Insights Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-xs uppercase font-bold text-gray-400 tracking-wider">Attendance Status</div>
            <div className="text-3xl font-black text-emerald-600 mt-2">{studentTrack.attendance}</div>
            <p className="text-xs text-gray-400 mt-1">Above minimum benchmark requirement (75%)</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-xs uppercase font-bold text-gray-400 tracking-wider">Cumulative GPA</div>
            <div className="text-3xl font-black text-indigo-600 mt-2">{studentTrack.gpa} / 4.00</div>
            <p className="text-xs text-gray-400 mt-1">Class Rank: Top 5% standing</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <div className="text-xs uppercase font-bold text-gray-400 tracking-wider">Pending Term Dues</div>
              <div className="text-3xl font-black text-rose-600 mt-2">{studentTrack.feeAmount}</div>
            </div>
            <button 
              onClick={() => alert("Redirecting secure gateway merchant processing...")}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-sm"
            >
              Pay Now
            </button>
          </div>
        </div>

        {/* Interactive Faculty Direct Communication Workspace */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-3xl overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-100 p-4 font-bold text-gray-700 flex items-center gap-2">
            💬 Dedicated Portal Connect to Mentor (Dr. Angela Yu)
          </div>
          
          <div className="p-6 h-64 overflow-y-auto space-y-3 bg-slate-50/50">
            {chatLog.map(chat => (
              <div key={chat.id} className={`flex ${chat.sender === 'Parent' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-xs font-medium shadow-sm ${chat.sender === 'Parent' ? 'bg-teal-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border rounded-tl-none'}`}>
                  <span className="block opacity-50 font-bold text-[10px] uppercase mb-0.5">{chat.sender}</span>
                  {chat.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white flex gap-2">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type inquiries to your child's advisor..."
              className="flex-1 border rounded-xl px-4 py-2 text-xs focus:outline-teal-500" 
            />
            <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 rounded-xl text-xs transition-colors shadow-sm">
              Send
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}