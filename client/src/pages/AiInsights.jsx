import React, { useState } from 'react';

export default function AiInsights() {
  // Analytical metrics datasets computed by the AI Core Engine
  const summaryMetrics = {
    averageAttendance: "88.4%",
    predictedPassRate: "94.2%",
    studentsAtRisk: 3,
    anomalyCount: 2
  };

  const highRiskStudents = [
    { id: "STU-902", name: "Alex Mercer", attendance: "64.2%", predictedGPA: "2.1", factor: "Drastic Attendance Drop (Last 14 Days)" },
    { id: "STU-411", name: "David Vance", attendance: "71.0%", predictedGPA: "1.9", factor: "Missing Core Lab Submissions" }
  ];

  const courseBreakdowns = [
    { code: "CS 302", name: "Database Systems", performanceIdx: 92, status: "Optimal", color: "bg-emerald-500" },
    { code: "CS 201", name: "Data Structures", performanceIdx: 78, status: "Warning", color: "bg-amber-500" },
    { code: "MATH 250", name: "Linear Algebra", performanceIdx: 85, status: "Optimal", color: "bg-emerald-500" },
    { code: "UXD 101", name: "UX Design Concepts", performanceIdx: 61, status: "Critical Attention", color: "bg-rose-500" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Analytics Top Control Header Banner */}
        <div className="bg-gradient-to-r from-violet-700 to-indigo-800 text-white rounded-2xl p-8 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              Phase 5 Predictive Intelligence Engine
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">AI Insights & Institutional Analytics</h1>
          <p className="text-indigo-200 text-sm mt-1">Cross-referencing student attendance patterns, continuous assessment metrics, and automated risk models.</p>
        </div>

        {/* High-Level Analytical Scoreboard Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">Cohort Mean Attendance</p>
            <div className="text-3xl font-black text-gray-900 mt-2">{summaryMetrics.averageAttendance}</div>
            <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <span>↑</span> +1.4% vs Last Semester
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">Projected Graduation Rate</p>
            <div className="text-3xl font-black text-gray-900 mt-2">{summaryMetrics.predictedPassRate}</div>
            <div className="text-xs text-gray-400 mt-1">Based on 90-day assessment telemetry</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">Identified At-Risk Profiles</p>
            <div className="text-3xl font-black text-rose-600 mt-2">{summaryMetrics.studentsAtRisk} Students</div>
            <div className="text-xs text-rose-500 font-medium mt-1">Immediate intervention suggested</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">Pattern Anomalies Flagged</p>
            <div className="text-3xl font-black text-amber-600 mt-2">{summaryMetrics.anomalyCount} Log Events</div>
            <div className="text-xs text-amber-500 font-medium mt-1">Unusual grade distribution trends</div>
          </div>

        </div>

        {/* Primary Analytical Grid Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Section 1: Distribution Analysis Bar Dashboard Rendering (2/3 width) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Module Optimization Indexes</h3>
              <p className="text-xs text-gray-400 mt-0.5">Composite assessment health rankings generated via active class rosters.</p>
            </div>

            <div className="space-y-5 pt-2">
              {courseBreakdowns.map((course) => (
                <div key={course.code} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-700">{course.code} — {course.name}</span>
                    <span className="font-mono font-bold text-gray-500">{course.performanceIdx}% Performance</span>
                  </div>
                  {/* Tailwind-based Dynamic Horizontal Analytics Visualizer Bar */}
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`${course.color} h-full transition-all duration-500`} 
                      style={{ width: `${course.performanceIdx}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 uppercase">
                    <span>Status Tracker</span>
                    <span className="font-semibold">{course.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Predictive Risk Diagnostic Feed Panel (1/3 width) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">AI Risk Diagnostic Log</h3>
              <p className="text-xs text-gray-400 mt-0.5">Active triggers flagged for targeted intervention workflows.</p>
            </div>

            <div className="space-y-3 pt-2">
              {highRiskStudents.map((student) => (
                <div key={student.id} className="p-4 rounded-xl border border-rose-100 bg-rose-50/40 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{student.name}</h4>
                      <p className="text-[10px] text-gray-400 font-mono">{student.id}</p>
                    </div>
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      High Alert
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-white/60 p-2 rounded-lg border border-rose-50">
                    <div>
                      <span className="block text-gray-400 text-[9px] uppercase font-bold">Attendance</span>
                      <span className="font-semibold text-gray-700">{student.attendance}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 text-[9px] uppercase font-bold">Proj. GPA</span>
                      <span className="font-semibold text-gray-700">{student.predictedGPA}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-rose-700 font-medium">
                    ⚠️ <span className="underline">Trigger Reason:</span> {student.factor}
                  </p>
                </div>
              ))}
            </div>

            <button 
              onClick={() => alert("Dispatching automated remediation advisory notifications...")}
              className="w-full mt-2 bg-gray-900 hover:bg-black text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm"
            >
              Issue Cohort Advisory Alerts
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}