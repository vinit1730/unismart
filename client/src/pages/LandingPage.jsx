import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, UserCheck, GraduationCap } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center font-sans px-4">
      <div className="text-center max-w-xl">
        <div className="bg-blue-600 w-fit p-3 rounded-2xl text-white mx-auto mb-4 shadow-sm"><GraduationCap className="h-10 w-10" /></div>
        <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">UniSmart Academic Engine</h1>
        <p className="text-sm text-gray-500 mt-2">Enterprise-grade attendance tracking lifecycle paired with child-process automated Python AI model analytics.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <div onClick={() => navigate('/login?role=admin')} className="bg-white p-5 border border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 transition-all shadow-xs">
            <ShieldAlert className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <h3 className="font-bold text-gray-900 text-sm">Super Admin System</h3>
          </div>
          <div onClick={() => navigate('/login?role=faculty')} className="bg-white p-5 border border-gray-200 rounded-xl cursor-pointer hover:border-teal-500 transition-all shadow-xs">
            <UserCheck className="h-6 w-6 text-teal-600 mx-auto mb-2" />
            <h3 className="font-bold text-gray-900 text-sm">Faculty Operational Hub</h3>
          </div>
        </div>
      </div>
    </div>
  );
}