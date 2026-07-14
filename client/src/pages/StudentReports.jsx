import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function StudentReports() {
  const studentInfo = { name: "John Doe", id: "2026094", major: "Computer Science", gpa: "3.85" };
  const attendanceData = [{ code: "CS 302", course: "Database Systems", attended: 28, total: 30, pct: "93.3%" }];
  const resultsData = [{ code: "CS 302", course: "Database Systems", internals: 38, externals: 54, total: 92, grade: "A+" }];

  const exportAttendancePDF = () => {
    const doc = new jsPDF();
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Attendance Summary Report", 14, 20);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Student: ${studentInfo.name} (${studentInfo.id})`, 14, 30);
    
    doc.autoTable({
      startY: 38,
      head: [["Course Code", "Course Title", "Attended", "Total", "%"]],
      body: attendanceData.map(item => [item.code, item.course, item.attended, item.total, item.pct]),
    });
    doc.save(`Attendance_${studentInfo.id}.pdf`);
  };

  const exportCompleteExcel = () => {
    const workbook = XLSX.utils.book_new();
    const summarySheet = XLSX.utils.aoa_to_sheet([["Name", studentInfo.name], ["GPA", studentInfo.gpa]]);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
    XLSX.writeFile(workbook, `Report_${studentInfo.id}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-2">📊 Reports Hub</h2>
        <p className="text-sm text-gray-500 mb-6">Download your academic transcript summaries and attendance sheets.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={exportAttendancePDF} className="p-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-sm">
            Download Attendance PDF
          </button>
          <button onClick={exportCompleteExcel} className="p-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all shadow-sm">
            Export Transcript Excel
          </button>
        </div>
      </div>
    </div>
  );
}