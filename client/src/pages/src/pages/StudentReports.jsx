import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function StudentReports() {
  // Dummy student data structures matching your features
  const studentInfo = {
    name: "John Doe",
    id: "2026094",
    major: "Computer Science",
    gpa: "3.85"
  };

  const attendanceData = [
    { code: "CS 302", course: "Database Management Systems", attended: 28, total: 30, pct: "93.3%" },
    { code: "CS 201", course: "Data Structures & Algorithms", attended: 26, total: 30, pct: "86.6%" },
    { code: "UXD 101", course: "Introduction to UX Design", attended: 29, total: 30, pct: "96.6%" },
    { code: "MATH 250", course: "Linear Algebra", attended: 27, total: 30, pct: "90.0%" }
  ];

  const resultsData = [
    { code: "CS 302", course: "Database Management Systems", internals: 38, externals: 54, total: 92, grade: "A+" },
    { code: "CS 201", course: "Data Structures & Algorithms", internals: 35, externals: 50, total: 85, grade: "A" },
    { code: "UXD 101", course: "Introduction to UX Design", internals: 37, externals: 52, total: 89, grade: "A-" },
    { code: "MATH 250", course: "Linear Algebra", internals: 36, externals: 51, total: 87, grade: "A-" }
  ];

  // ==========================================
  // 1. GENERATE ATTENDANCE PDF EXPORT
  // ==========================================
  const exportAttendancePDF = () => {
    const doc = new jsPDF();

    // Document Header Title Styling
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(30, 41, 59); // Tailwind Slate 800
    doc.text("UNISMART STUDENT PORTAL", 14, 20);

    doc.setFontSize(14);
    doc.setTextColor(79, 70, 229); // Indigo 600
    doc.text("Official Attendance Summary Report", 14, 28);

    // Meta metadata elements block
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 33, 196, 33);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Student Name: ${studentInfo.name}`, 14, 40);
    doc.text(`Student ID: #${studentInfo.id}`, 14, 46);
    doc.text(`Major/Course: ${studentInfo.major}`, 120, 40);
    doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 120, 46);

    // Dynamic auto-table structure generation
    const tableColumn = ["Course Code", "Course Title", "Attended Classes", "Total Classes", "Presence %"];
    const tableRows = attendanceData.map(item => [
      item.code,
      item.course,
      item.attended,
      item.total,
      item.pct
    ]);

    doc.autoTable({
      startY: 54,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [67, 56, 202] }, // Indigo Primary Headings Color
      styles: { font: "Helvetica", fontSize: 10, cellPadding: 4 }
    });

    // Save compiled filesystem entity binary array downstream
    doc.save(`Attendance_Report_${studentInfo.id}.pdf`);
  };

  // ==========================================
  // 2. GENERATE COMPREHENSIVE EXCEL EXPORT
  // ==========================================
  const exportCompleteExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Tab 1: Metadata Summary Layout Array
    const summaryRows = [
      ["UNISMART ACADEMIC PERFORMANCE REPORT"],
      [],
      ["Student Name:", studentInfo.name],
      ["Student ID:", studentInfo.id],
      ["Major Stream:", studentInfo.major],
      ["Cumulative GPA:", studentInfo.gpa],
      ["Generated Timestamp:", new Date().toLocaleString()]
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Profile Summary");

    // Tab 2: Attendance Registry Matrix Conversion
    const attendanceHeaders = [["Course Code", "Course Title", "Attended", "Total Classes", "Percentage"]];
    const attendanceBody = attendanceData.map(d => [d.code, d.course, d.attended, d.total, d.pct]);
    const attendanceSheet = XLSX.utils.aoa_to_sheet([...attendanceHeaders, ...attendanceBody]);
    XLSX.utils.book_append_sheet(workbook, attendanceSheet, "Attendance Metrics");

    // Tab 3: Semester Grade Sheets Structure Mapping
    const resultsHeaders = [["Course Code", "Course Title", "Internals (40)", "Externals (60)", "Total Overall", "Grade Awarded"]];
    const resultsBody = resultsData.map(r => [r.code, r.course, r.internals, r.externals, r.total, r.grade]);
    const resultsSheet = XLSX.utils.aoa_to_sheet([...resultsHeaders, ...resultsBody]);
    XLSX.utils.book_append_sheet(workbook, resultsSheet, "Academic Grades");

    // Process output file save pipeline download handling
    XLSX.writeFile(workbook, `Academic_Report_${studentInfo.id}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">📊 Document Hub & Reports Center</h2>
          <p className="text-sm text-gray-500 mb-6">Download verified tracking summaries, certificates, and metrics files natively.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* PDF Generation Card */}
            <div className="p-5 border border-gray-200 rounded-xl hover:border-indigo-500 transition-all bg-gray-50 flex flex-col justify-between">
              <div>
                <span className="text-3xl">📄</span>
                <h3 className="font-bold text-lg mt-2 text-gray-800">Attendance Report (PDF)</h3>
                <p className="text-xs text-gray-500 mt-1 mb-4">Generates an authorized clean summary presentation page with tables ready for print validation.</p>
              </div>
              <button 
                onClick={exportAttendancePDF}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm shadow-sm"
              >
                Download PDF Document
              </button>
            </div>

            {/* Excel Spreadsheets Card */}
            <div className="p-5 border border-gray-200 rounded-xl hover:border-emerald-500 transition-all bg-gray-50 flex flex-col justify-between">
              <div>
                <span className="text-3xl">📈</span>
                <h3 className="font-bold text-lg mt-2 text-gray-800">Complete Transcript Data (Excel)</h3>
                <p className="text-xs text-gray-500 mt-1 mb-4">Compiles comprehensive profiles, attendances, and internal score logs into distinct layout workbook worksheets.</p>
              </div>
              <button 
                onClick={exportCompleteExcel}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm shadow-sm"
              >
                Export Excel Workbook (.xlsx)
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}